import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiUrl, User } from "../../types";
import PlayerAvatar from "../Avatar/PlayerAvatar";
import PlayerBanner from "../Banner/PlayerBanner";
import PlayerUsername from "../Username/PlayerUsername";
import axios from "axios";

const PlayerProfile: React.FC = () => {
  const { userData } = useOutletContext<{ userData: User[] }>();
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loggedInUser, setLoggedInUser] = useState<User>();
  const isFriend = loggedInUser?.comrades.find((i) => i === user?._id)
    ? true
    : false;

  console.log(isFriend);

  const handleFriendRequest = async () => {
    const sender = { sender: loggedInUser?._id };
    await axios.post(apiUrl + "/user/sendFriendRequest/" + id, sender);
  };

  useEffect(() => {
    if (userData) {
      setUser(userData.find((i) => i._id === id));
      axios.get(apiUrl + "/user/loggedInUser").then((res) => {
        setLoggedInUser(res.data);
        console.log(res.data);
      });
    }
  }, [id, userData]);

  return (
    <main className="w-full p-10 animate-fadeInFast">
      <h1 className="text-4xl font-bold my-10">The Legend:</h1>

      {user && (
        <div className="flex flex-col">
          <PlayerUsername username={user.username} />
          <div className="flex w-full">
            {/*Avatar Component*/}
            <PlayerAvatar avatar={user.avatar} />

            <PlayerBanner
              handleFriendRequest={handleFriendRequest}
              bannerColor={user.banner}
              lvl={user.lvl}
              taskTodayCount={user.taskToday.length || 0}
              isFriend={isFriend}
            />
          </div>
          <div className="p-2"></div>
        </div>
      )}
    </main>
  );
};

export default PlayerProfile;
