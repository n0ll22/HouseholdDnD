import React from "react";

import { User } from "../types";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface Props {
  users: User[];
  handleRequest: (id: string, answer: boolean, index: number) => void;
  userId: string;
}

const PendingRequest: React.FC<Props> = ({ users, handleRequest, userId }) => {
  console.log(users);
  return (
    <div className="divide-y">
      {users.map((user: User, index) => (
        <div
          className={`request${index} flex items-center space-x-2 w-fit`}
          key={index}
        >
          <Link
            to={"/users/" + user._id}
            className="flex items-center cursor-pointer py-2 hover:bg-gray-200 rounded "
          >
            <img
              width={50}
              height={50}
              src={`/src/img/pfps/${user.avatar}`}
              alt=""
              className="rounded-lg mx-2"
            />
            <p className="w-64 md:w-52 sm:w-32">{user.username}</p>
            <p className="w-32 sm:w-16">LVL: {user.lvl}</p>
          </Link>
          <div className="">
            {user.pendingComrade.find((i) => i.sender === userId) ? (
              <button
                className="border-2 p-1 mx-2 border-green-500 bg-green-200 text-green-500 rounded hover:bg-green-100 active:translate-y-1 transition"
                onClick={() => handleRequest(user._id, true, index)}
              >
                <FaCheck />
              </button>
            ) : (
              <button
                className="disabled:bg-green-100 disabled:cursor-not-allowed disabled:border-green-200 disabled:text-green-200 border-2 p-1 mx-2 "
                onClick={() => handleRequest(user._id, true, index)}
              >
                <FaCheck />
              </button>
            )}
            <button
              className="border-2 p-1 mx-2 border-red-500  bg-red-200 text-red-500 rounded hover:bg-red-100 active:translate-y-1 transition"
              onClick={() => {
                handleRequest(user._id, false, index);
              }}
            >
              <FaXmark />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingRequest;
