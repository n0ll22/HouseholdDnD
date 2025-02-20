import React from "react";
import { RiBeerLine } from "react-icons/ri";

interface Props {
  bannerColor: string;
  taskTodayCount: number;
  lvl: number;
  isFriend: boolean;
  handleFriendRequest: () => void;
}

const UserBanner: React.FC<Props> = ({
  isFriend,
  bannerColor,
  lvl,
  taskTodayCount,
  handleFriendRequest,
}) => {
  return (
    <div
      className={`
                ${bannerColor}
             flex w-full justify-between flex-wrap`}
    >
      <div className="p-10 flex space-x-10">
        <p className="text-white drop-shadow">LVL: {lvl}</p>
        <p className="text-white drop-shadow">
          Today's Tasks: {taskTodayCount}
        </p>
      </div>
      {isFriend ? (
        <div className="p-10">
          <button className=" h-8 w-32 border drop-shadow rounded bg-white cursor-default">
            <span className="w-full flex justify-around items-center">
              Comrades
              <RiBeerLine />
            </span>
          </button>
        </div>
      ) : (
        <div className="p-10">
          <button
            className=" h-8 w-32 border drop-shadow rounded bg-white hover:bg-gray-200 active:translate-y-1 transition"
            onClick={handleFriendRequest}
          >
            Add Comrade
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBanner;
