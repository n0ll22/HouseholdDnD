import React, { ChangeEvent, useEffect, useState } from "react";
import useGet from "../../Hooks/useGet";
import levels from "../../lookuplvl.json";
import TaskComplete from "../../Components/TaskCounter/TaskCounter";
import {
  apiUrl,
  Process,
  QueryProps,
  TaskDataProp,
  TaskProp,
} from "../../Components/types";

import axios from "axios";
import { timeInHMS } from "../../timeConversion";
import HUD from "../../Components/HUD";
import { useUser } from "../../Components/Auth/UserContext";

interface RenderHUDProps {
  lvl: number;
  startExp: number;
  nextLvlExp: number;
  currentExp: number;
}

const TaskCounterPage: React.FC = () => {
  const [queries, setQueries] = useState<QueryProps>({
    searchOn: "title",
    search: "",
    sortBy: "title",
    order: "asc",
    page: 1,
    limit: 100,
  });

  const userData = useUser();

  const {
    data: taskData,
    //pending: taskPending,
    //error: taskError,
  } = useGet<TaskDataProp>(
    `${apiUrl}/task?search=${queries.search}&searchOn=${queries.searchOn}&sortBy=${queries.sortBy}&order=${queries.order}&page=${queries.page}&limit=${queries.limit}`
  );

  const [currentTasks, setCurrentTasks] = useState<TaskProp[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [progressbar, setProgressbar] = useState(0);
  const [renderTime, setRenderTime] = useState<string>("00:00:00");
  const [selectedTask, setSelectedTask] = useState<TaskProp | null>(null);
  const [process, setProcess] = useState<Process | null>(null);
  const [renderHUD, setRenderHUD] = useState<RenderHUDProps | null>(null);
  const [isLevelUp, setIsLevelUp] = useState<boolean>(false);
  const tasks = taskData?.tasks || [];

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQueries((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleAddTask = async (task: TaskProp) => {
    if (userData) {
      const finalData = {
        userId: userData!._id,
        taskId: task._id,
      };

      await axios
        .put(`${apiUrl}/user/addTaskToday`, finalData)
        .then((res) => {
          console.log(res.data.message), setCurrentTasks(res.data.task);
        })
        .catch((err) => console.error(err));

      const startTime = Date.now();

      localStorage.setItem(
        "currentTask",
        JSON.stringify({
          id: task._id,
          startTime,
          duration: parseInt(task._length),
        })
      );

      setSelectedTask(task);
      startProcess(userData._id, task._id, parseInt(task._length));
    }
  };

  const startProcess = async (
    userId: string,
    taskId: string,
    duration: number
  ) => {
    try {
      const res = await axios.post(`${apiUrl}/task/startProcess`, {
        userId,
        taskId,
        duration,
      });
      setProcess(res.data.process);
    } catch (error: any) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const handleRemoveTask = async (task: TaskProp) => {
    const finalData = {
      userId: userData!._id,
      taskId: task._id,
      exp: task.exp,
    };
    console.log(process);
    await axios
      .put(
        `${apiUrl}/user/removeTaskToday?inProgress=${process ? true : false}`,
        finalData
      )
      .then((res) => {
        setCurrentTasks(res.data.task);
        calculateLevel(res.data.newExp);
      })
      .catch((err) => console.error(err));

    localStorage.removeItem("currentTask");
    setSelectedTask(null);
    setProcess(null);
    setProgressbar(0);
    setRenderTime("Cancelled");
    if (process) {
      await axios
        .delete(`${apiUrl}/task/process?processId=${process?._id}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.error(err));
    }
  };

  const handleFinish = async () => {
    if (!selectedTask && userData) {
      setCurrentTasks([]);
      await axios.delete(`${apiUrl}/user/finishDay/${userData!._id}`);
    }
  };

  const updateProcess = async (processId: string, progress: number) => {
    try {
      const res = await axios.put(`${apiUrl}/task/updateProgress`, {
        processId,
        progress,
      });
      setProcess(res.data.process);
    } catch (error: any) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const completeProcess = async (processId: string) => {
    if (userData?._id) {
      await axios.post(`${apiUrl}/task/complete`, { processId }).then((res) => {
        console.log(res);
        setRenderHUD((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            currentExp: res.data.newExp,
          };
        });

        console.log(renderHUD);

        if (res.data.newExp > renderHUD!.nextLvlExp) {
          setIsLevelUp(true);
        }

        calculateLevel(res.data.newExp);
        setProcess(null);
        console.log("calculate new exp");
      });

      await axios
        .delete(`${apiUrl}/task/process?processId=${processId}`)
        .then(() => {
          setRenderTime("Done!");
        })
        .catch((err) => console.error(err.response.data.message));
    }
  };

  const calculateLevel = (newExp: number | undefined) => {
    if (typeof newExp === "number" && newExp > -1) {
      if (userData?.lvl === 1) {
        console.log(renderHUD);
        setRenderHUD({
          currentExp: newExp,
          lvl: 1,
          nextLvlExp: levels[0].exp + levels[0].diff,
          startExp: 0,
        });
      }
      const getCurrentLevelIndex = levels.findIndex((l) => l.exp > newExp);
      const getCurrentLevel = levels[getCurrentLevelIndex - 1];

      setRenderHUD({
        currentExp: newExp,
        lvl: getCurrentLevel.lvl,
        nextLvlExp: getCurrentLevel.exp + getCurrentLevel.diff,
        startExp: getCurrentLevel.exp,
      });
    }
  };

  useEffect(() => {
    calculateLevel(userData?.exp);
  }, [userData]);

  // Resume process on reload
  useEffect(() => {
    if (userData?._id) {
      console.log(userData._id);
      axios
        .get(`${apiUrl}/task/process?userId=${userData?._id}`)
        .then((res) => {
          const taskProc = res.data[0];
          if (!taskProc) return;

          setProcess(res.data[0]);
          setSelectedTask(taskProc.taskId);

          localStorage.setItem(
            "currentTask",
            JSON.stringify({
              id: res.data.taskId,
              startTime: new Date(taskProc.startTime).getTime(),
              duration: taskProc.duration,
            })
          );
        })
        .catch((err) => console.error("Process fetch error", err));
    }
  }, [userData]);

  useEffect(() => {
    if (!selectedTask || !process) return;

    const saved = localStorage.getItem("currentTask");
    if (!saved) return;

    const { startTime, duration } = JSON.parse(saved);
    if (!startTime || !duration) return;

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsed = elapsedMs / 1000;
      const remaining = Math.max(duration - elapsed, 0);
      const percent = Math.min((elapsed / duration) * 100, 100);

      setProgressbar(percent);
      setRenderTime(remaining > 0 ? timeInHMS(Math.ceil(remaining)) : "Done!");
      updateProcess(process._id, percent);

      if (remaining <= 0) {
        clearInterval(interval);
        completeProcess(process._id);
        setSelectedTask(null);
        localStorage.removeItem("currentTask");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTask, process]);

  useEffect(() => {
    if (userData?.taskToday?.length) {
      axios
        .post(`${apiUrl}/task/taskByIds`, userData.taskToday)
        .then((res) => setCurrentTasks(res.data))
        .catch((err) => console.error(err));
    }
  }, [userData?.taskToday]);

  useEffect(() => {
    setIsVisible(!!queries.search);
  }, [queries.search]);

  return (
    <>
      {userData && renderHUD && (
        <HUD
          isLevelUp={isLevelUp}
          setIsLevelUp={setIsLevelUp}
          renderHUD={renderHUD}
          setRenderHUD={setRenderHUD}
        />
      )}
      {userData && tasks && (
        <TaskComplete
          process={process}
          currentTasks={currentTasks}
          tasks={tasks}
          queries={queries}
          isVisible={isVisible}
          handleRemoveTask={handleRemoveTask}
          handleSearch={handleSearch}
          handleFinish={handleFinish}
          setIsVisible={setIsVisible}
          progressbar={progressbar}
          renderTime={renderTime}
          selectedTask={selectedTask}
          handleAddTask={handleAddTask}
        />
      )}
    </>
  );
};

export default TaskCounterPage;
