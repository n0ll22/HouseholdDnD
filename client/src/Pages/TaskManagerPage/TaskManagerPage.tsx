import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import useGet from "../../Hooks/useGet";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { Task } from "../../Components/types";

const TaskManagerPage: React.FC = () => {
    const {
        data: tasks,
        pending,
        error,
    } = useGet<Task[]>("http://localhost:8000/task/");

    const [pathname, setPathname] = useState<string | undefined>(
        location.pathname.substring(13)
    );

    const [filteredTask, setFilteredTask] = useState<Task[]>([]);

    const [search, setSearch] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(() => e.target.value);
        if (tasks) {
            setFilteredTask(() =>
                tasks.filter((v) =>
                    v.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        }
    };

    useEffect(() => {
        if (tasks) {
            setFilteredTask(tasks);
        }
    }, [tasks]);

    console.log(filteredTask);

    return (
        <>
            <div className="flex pt-20 px-10 items-center justify-between">
                <div className="">
                    <Link to="list">
                        <button
                            className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                                pathname === "list"
                                    ? "bg-black text-white"
                                    : "bg-none"
                            }`}
                            onClick={() =>
                                setPathname(() =>
                                    location.pathname.substring(13)
                                )
                            }
                        >
                            List Tasks
                        </button>
                    </Link>
                    <Link to="edit">
                        <button
                            className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                                pathname === "edit"
                                    ? "bg-black text-white"
                                    : "bg-none"
                            }`}
                            onClick={() =>
                                setPathname(() =>
                                    location.pathname.substring(13)
                                )
                            }
                        >
                            Edit Tasks
                        </button>
                    </Link>
                    <Link to="add">
                        <button
                            className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                                pathname === "add"
                                    ? "bg-black text-white"
                                    : "bg-none"
                            }`}
                            onClick={() =>
                                setPathname(() =>
                                    location.pathname.substring(13)
                                )
                            }
                        >
                            Add Tasks
                        </button>
                    </Link>
                </div>
                <div>
                    <input
                        type="text"
                        className="p-2 rounded-md border border-black"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => handleSearch(e)}
                    />
                </div>
            </div>
            {filteredTask && <Outlet context={{ filteredTask }} />}
            {/* Loading spinner */}
            {pending && (
                <div className="w-full flex items-center justify-center">
                    <LoadingSpinner loading={pending} />
                </div>
            )}
            {error && <div>Network Error</div>}
        </>
    );
};

export default TaskManagerPage;
