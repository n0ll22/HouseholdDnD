import React from "react";

import { TaskProp, QueryProps, Process } from "../types";
import { timeInHMS } from "../../timeConversion";
import { FaXmark } from "react-icons/fa6";

interface TaskCompleteProps {
  currentTasks: TaskProp[];
  tasks: TaskProp[];
  queries: QueryProps;
  isVisible: boolean;
  handleRemoveTask: (task: TaskProp) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFinish: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTask: (task: TaskProp) => void;
  progressbar: number;
  renderTime: string;
  selectedTask: TaskProp | null;
  process: Process | null;
}

const TaskComplete: React.FC<TaskCompleteProps> = ({
  currentTasks,
  tasks,
  queries,
  isVisible,
  progressbar,
  selectedTask,
  renderTime,
  process,
  handleAddTask,
  handleRemoveTask,
  handleSearch,
  handleFinish,
  setIsVisible,
}) => {
  return (
    <main className="flex flex-col w-full items-start animate-fadeInFast">
      <div className="flex w-full justify-center">
        <div className="w-4/5 flex flex-col items-center space-y-4">
          <h3 className="font-bold text-4xl mt-20 text-center">
            Search tasks:
          </h3>
          <input
            className="w-80 p-2 rounded-lg border"
            type="search"
            placeholder="Search..."
            value={queries.search}
            autoComplete="off"
            onClick={() => setIsVisible(true)}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setIsVisible(false), 100)}
          />

          <div className="absolute z-10 top-40 w-80 rounded-md max-h-96 overflow-y-auto bg-white">
            {isVisible &&
              !process &&
              tasks?.map((task) => (
                <div
                  key={task._id}
                  className="p-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleAddTask(task)}
                >
                  <p>{task.title}</p>
                  <div className="flex justify-between">
                    <span className="w-2/3">
                      {timeInHMS(parseInt(task._length))}
                    </span>
                    <span className="w-1/3 text-right">EXP: {task.exp}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="w-3/4 md:w-full">
            <div className="bg-white rounded-xl overflow-y-auto max-h-[500px]">
              {currentTasks && currentTasks.length > 0 ? (
                currentTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 items-center hover:bg-gray-100/50 rounded-md"
                  >
                    <div className="col-span-2 p-2">{task.title}</div>
                    <div>EXP {task.exp}</div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRemoveTask(task)}
                        className="text-red-700 mr-2"
                      >
                        <FaXmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2">No task in progress...</div>
              )}
            </div>
          </div>

          <div className="relative h-6 w-3/4 bg-gray-200 rounded-md">
            <div
              className="h-6 bg-green-400 rounded-md transition-all duration-1000 ease-linear"
              style={{ width: `${progressbar}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-md">
              {renderTime ? renderTime : selectedTask ? "Done!" : null}
            </div>
          </div>

          <input
            className="w-fit cursor-pointer bg-white p-2 rounded-lg border hover:bg-gray-200 active:bg-gray-300 active:translate-y-1"
            type="button"
            disabled={selectedTask ? true : false}
            value="Finish Day"
            onClick={handleFinish}
          />
        </div>

        <div
          className="w-1/5 ml-5 h-screen bg-cover bg-center xl:hidden"
          style={{ backgroundImage: `url("./src/img/meditation.jpg")` }}
        ></div>
      </div>
    </main>
  );
};

export default TaskComplete;
