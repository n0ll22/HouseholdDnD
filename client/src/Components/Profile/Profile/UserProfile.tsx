import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl, FriendshipProp, UserProp } from "../../types";
import PlayerAvatar from "../Avatar/PlayerAvatar";
import PlayerBanner from "../Banner/PlayerBanner";
import PlayerUsername from "../Username/PlayerUsername";
import axios, { AxiosResponse } from "axios";
import socket from "../../socket";
import { useNotification } from "../../Notification/Notification";
import { useUser } from "../../Auth/UserContext";

// Top of file, outside component:

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const { notify } = useNotification();
  const loggedInUser = useUser();
  const [user, setUser] = useState<UserProp>();

  const [friendship, setFriendship] = useState<FriendshipProp | null>();
  const nav = useNavigate();

  const handleNavigationToChat = async () => {
    if (loggedInUser) {
      await axios
        .get(
          apiUrl +
            `/chat/getOneByParticipants?user1=${id?.toString()}&user2=${loggedInUser._id.toString()}&onlyId=${true}`
        )
        .then((res: AxiosResponse<{ chatId: string }>) =>
          nav(`/profile/chat/${res.data.chatId}`)
        );
    }
  };

  const handleSendFriendRequest = () => {
    if (loggedInUser) {
      socket.emit("send_friendRequest", {
        senderId: loggedInUser._id,
        receiverId: id,
        status: "pending",
      });
      notify("Friend request sent!", null);
    }
  };

  const handleUnsendFriendRequest = (chatId: string) => {
    if (loggedInUser) {
      socket.emit("unsend_friendRequest", {
        chatId,
        loggedInUserId: loggedInUser._id,
        userId: id,
      });
      notify("Friend request unsent!", null);
    }
  };

  useEffect(() => {
    if (friendship?.status === undefined) {
      setFriendship((prev) => {
        if (!prev) return prev;
        return { ...prev, status: "none" };
      });
    }
  }, [friendship]);

  useEffect(() => {
    if (loggedInUser?._id) {
      const onReceiveAnswer = (res: FriendshipProp) => {
        console.log("Friend request answer received:", res);
        setFriendship(res?.status === "refused" ? null : res);
      };

      socket.on("receive_friendRequest", (res) => {
        console.log("Friend request received:", res);
        setFriendship(res);
      });

      socket.on("friendRequest_sent", (res) => {
        console.log("Friend request sent:", res.message);
        setFriendship(res);
      });

      socket.on("receive_unsent_friendRequest", (res) => {
        console.log("Friend request was unsent:", res);
        setFriendship(null);
      });

      socket.on("receive_friendRequest_answer", onReceiveAnswer);

      socket.on("friendRequest_error", (err) => {
        console.error("Friend request error:", err.message);
      });
    }
    return () => {
      socket.off("receive_friendRequest");
      socket.off("friendRequest_sent");
      socket.off("receive_unsent_friendRequest");
      socket.off("friendRequest_error");
    };
  }, [loggedInUser]);

  console.log("loggedinuser:", loggedInUser, id);

  useEffect(() => {
    if (id && loggedInUser?._id) {
      axios.get(apiUrl + "/user/" + id).then((res: AxiosResponse<UserProp>) => {
        setUser(res.data);
      });

      axios
        .get(
          apiUrl +
            `/friendship/getOneFriendship?user1=${loggedInUser._id}&user2=${id}`
        )
        .then((res) => setFriendship(res.data));
    }
  }, [id, loggedInUser]);

  //console.log(loggedInUser);
  //console.log(friendship);

  return (
    <main className="w-full p-10 animate-fadeInFast">
      <h1 className="text-4xl font-bold my-10">The Legend:</h1>

      {user && loggedInUser && (
        <div className="flex flex-col">
          <PlayerUsername username={user.username} />
          <div className="flex w-full">
            <PlayerAvatar avatar={user.avatar} />
            <PlayerBanner
              handleSendFriendRequest={handleSendFriendRequest}
              handleUnsendFriendRequest={handleUnsendFriendRequest}
              handleNavigationToChat={handleNavigationToChat}
              bannerColor={user.banner}
              username={user.username}
              lvl={user.lvl}
              taskTodayCount={user.taskToday.length || 0}
              friendship={friendship}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default UserProfile;
