import React from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { Task } from "../../types";

const ListTask: React.FC = () => {
    const { filteredTask } = useOutletContext<{ filteredTask: Task[] }>();

    return (
        <main className=" flex flex-col w-full items-start p-10 animate-fadeInFast">
            <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl my-10">
                Hall of Tasks
            </h1>
            <div className="flex flex-wrap">
                {filteredTask.map((i, index) => (
                    <div
                        key={index}
                        className="mb-10 w-64 h-60 mr-10 border-b-2 p-2 flex flex-col justify-between"
                    >
                        <h2 className="font-bold text-3xl h-20">{i.title}</h2>
                        <p className="mb-2">{i.description}</p>
                        <div className="flex w-full justify-between font-bold">
                            <div>EXP: {i.exp}</div>
                            <Link to={"tutorial/" + i._id}>
                                <div> {">"}Tutorials</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <Outlet />
        </main>
    );
};

export default ListTask;
