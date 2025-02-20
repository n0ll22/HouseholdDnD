import React from "react";
import List from "../List/List.tsx";
import { User, ExtendedUser } from "../types.ts";
import { useNavigate, useOutletContext } from "react-router-dom";

const UserList: React.FC = () => {
  const { userData, loggedInUser } = useOutletContext<{
    userData: User[];
    loggedInUser: User;
  }>();

  const navigate = useNavigate();

  const organize: ExtendedUser[] = [];

  const handleOnClick = (id: string) => {
    if (id !== loggedInUser._id) navigate(`/users/${id}`);
  };

  if (userData) {
    userData
      .filter((v) => v._id !== loggedInUser._id)
      .map((i: User) => {
        organize.push({
          avatarDiv: (
            <div
              className="bg-center bg-cover w-14 h-14 rounded-full"
              style={{
                backgroundImage: `url("/src/img/pfps/${i.avatar}")`,
              }}
            ></div>
          ),
          username: i.username,
          lvl: i.lvl,
          _id: i._id,
        });
      });
  }

  return (
    <main className="flex flex-col w-full items-start p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-20">
        Hall of Fame
      </h1>

      <List
        headerTitle={["Avatar", "User", "LVL"]}
        size={3}
        data={organize}
        loading={false}
        error={null}
        handleOnClick={handleOnClick}
      />
    </main>
  );
};

export default UserList;
