import React, { ChangeEvent } from "react";
import HUD from "../HUD";
import { User, Task } from "../types";

//Adattípusok...
interface TaskCompleteProps {
    userData: User;
    currentTasks: Task[];
    input: string;
    searchTask: Task[];
    renderExp: number;
    handleAddTask: (task: Task) => void;
    handleRemoveTask: (index: number) => void;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    handleFinish: () => void;
}

const TaskComplete: React.FC<TaskCompleteProps> = ({
    userData,
    currentTasks,
    input,
    searchTask,
    renderExp,
    handleAddTask,
    handleFinish,
    handleRemoveTask,
    handleSearch,
}) => {
    //JSX...
    return (
        <main className="flex flex-col w-full items-start animate-fadeInFast">
            {userData && <HUD exp={renderExp} />}
            <div className="flex w-full justify-center ">
                <div className="w-4/5 flex flex-col items-center p-2">
                    <h3 className="font-bold mt-20 w-full text-center">
                        Search for a task:
                    </h3>
                    <input
                        className="w-64 py-1 px-2 rounded-lg border "
                        type="search"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        onChange={handleSearch}
                        value={input}
                        autoComplete="off"
                    />
                    <div className="absolute mt-36 w-52 max-h-96 overflow-y-auto bg-white">
                        {searchTask &&
                            input &&
                            searchTask.map((i) => (
                                <div
                                    onClick={() => handleAddTask(i)}
                                    className="p-1 hover:bg-gray-200 cursor-pointer"
                                    key={i._id}
                                >
                                    {i.title}
                                </div>
                            ))}
                    </div>
                    <div className="mt-5 w-3/4 md:w-full">
                        <div className="bg-white p-2 rounded-xl">
                            {Array.isArray(currentTasks) &&
                                currentTasks.length > 0 && // Ellenőrizzük, hogy currentTasks valóban egy tömb-e
                                currentTasks.map((i: Task, index: number) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2"
                                    >
                                        <div className="w-2/4 block">
                                            {i.title}
                                        </div>
                                        <div className="w-1/4 ">
                                            EXP {i.exp}
                                        </div>
                                        <div className="w-1/4 text-right">
                                            <input
                                                type="button"
                                                value=""
                                                className="w-4 h-4 bg-red-400 hover:bg-red-300 active:bg-red-500"
                                                onClick={() =>
                                                    handleRemoveTask(index)
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            {currentTasks?.length === 0 && (
                                <div>
                                    <div>No task's done yet...</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        className="w-fit cursor-pointer bg-white py-1 px-2 rounded-lg border mt-5 hover:bg-gray-200 active:bg-gray-300 active:translate-y-1"
                        type="button"
                        value="Finish Day"
                        onClick={handleFinish}
                    />
                </div>

                <div
                    className="w-1/5 ml-5 h-screen bg-cover bg-center xl:hidden"
                    style={{
                        backgroundImage: `url("./src/img/meditation.jpg")`,
                    }}
                ></div>
            </div>
        </main>
    );
};

export default TaskComplete;
