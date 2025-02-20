import React, { ChangeEvent, useEffect, useState } from "react";
import useGet from "../../Hooks/useGet";
import TaskComplete from "../../Components/TaskCounter/TaskCounter";
import { Task, User } from "../../Components/types";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import axios from "axios";

const TaskCounterPage: React.FC = () => {
    const {
        data: userData,
        pending: userPending,
        error: userError,
    } = useGet<User>("http://localhost:8000/user/loggedInUser");
    const {
        data: taskData,
        pending: taskPending,
        error: taskError,
    } = useGet<Task[]>("http://localhost:8000/task/");

    //State-ek
    const [currentTasks, setCurrentTasks] = useState<Task[]>();
    const [input, setInput] = useState<string>("");
    const [searchTask, setSearchTask] = useState<Task[]>();
    const [renderExp, setRenderExp] = useState<number>(0);

    //Task hozzáadása a felhasználóhoz-------------------------------------------------
    const handleAddTask = async (task: Task) => {
        try {
            //Ellenőrizzük van-e már adat, mert ha nincs akkor errort dob undefined miatt, majd adjuk hozzá a segéváltozóhoz az új feladatot
            const updateTasks: Task[] = currentTasks ? currentTasks : [];
            updateTasks.push(task);

            const taskIds = updateTasks.map((i) => i._id);

            console.log(taskIds);

            setRenderExp((prev) => (prev += task.exp));

            //véglegesítsük az adatot, amit az adatbázis meg fog kapni
            const finalData = {
                userId: userData!._id,
                taskIds,
                expObj: task.exp,
            };
            console.log(finalData);
            //PUT request az adatbázis felé
            await axios
                .put("http://localhost:8000/user/addTaskToday", finalData)
                .then(() => console.log("Data added"))
                .catch((err) => console.error(err));

            setCurrentTasks(updateTasks);
            setInput(() => "");
        } catch (error) {
            console.error(error);
        }
    };

    //Task törlése-------------------------------------------------------------------
    const handleRemoveTask = async (index: number) => {
        try {
            //Ellenőrizzük van-e már adat, mert ha nincs akkor errort dob undefined miatt, majd adjuk hozzá a segéváltozóhoz az új feladatot
            const updateTasks: Task[] = [...(currentTasks ?? [])];

            //törlés az adott indexnél
            const expObj = { exp: -updateTasks[index].exp };
            updateTasks.splice(index, 1);

            const taskIds = updateTasks.map((i) => i._id);

            //exp kivonása törlés esetén;

            //feltöltendő adat véglegesítése
            const finalData = { userId: userData!._id, taskIds, expObj };
            setRenderExp((prev) => (prev += expObj.exp));
            console.log(finalData);

            //PUT request a frissítéshet
            await axios
                .put("http://localhost:8000/user/removeTaskToday", finalData)
                .then((res) => console.log(res))
                .catch((err) => console.error(err));

            //lista frissítése
            setCurrentTasks(updateTasks);
        } catch (err) {
            console.error(err);
        }
    };

    //Keresés kezelése-------------------------------------------------------------
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value); //Begépelt érték beállítása
        //ha van adat akkor szűrjük ki a tömböt a keresés alapján

        const searchData = taskData!.filter((i: Task) =>
            i.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        //eredmények betöltése a state-be
        setSearchTask(searchData);
    };

    //Nap lezárásának kezelése-----------------------------------------------------
    const handleFinish = async () => {
        //legyen üres lista
        setCurrentTasks(() => []);

        //user id alapján töröljük ki az adatokat (lehetett volna axios.remove...)
        await axios
            .delete("http://localhost:8000/user/finishDay/" + userData!._id)
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));

        window.location.reload();
    };

    //kezdeti rendernél betöltjük a
    useEffect(() => {
        if (userData?.taskToday) {
            const ids = userData?.taskToday;
            console.log(ids);
            axios
                .post("http://localhost:8000/task/taskByIds", ids)
                .then((res) => setCurrentTasks(res.data));
            setRenderExp(userData.exp);
        }
    }, [userData?.taskToday, userData?.exp]);

    return (
        <>
            {userData && taskData && (
                <TaskComplete
                    userData={userData}
                    currentTasks={currentTasks!}
                    input={input}
                    renderExp={renderExp}
                    searchTask={searchTask!}
                    handleAddTask={handleAddTask}
                    handleFinish={handleFinish}
                    handleRemoveTask={handleRemoveTask}
                    handleSearch={handleSearch}
                />
            )}
            {(userError || taskError) && <div>Network Error</div>}
            {(taskPending || userPending) && (
                <div className="w-full h-full flex items-center justify-center">
                    <LoadingSpinner loading={taskPending || userPending} />
                </div>
            )}
        </>
    );
};

export default TaskCounterPage;
