import axios from "axios";
import React, { useEffect, useState } from "react";
import { Notifications, UserProp } from "../../Components/types";

const NotificationPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProp>();
  const [notifications, setNotifications] = useState<Notifications[]>();

  const handleRead = async (i: Notifications) => {
    const updateNotification = {
      ...i,
      read: true,
    };

    console.log(updateNotification);

    await axios.put(
      "http://localhost:8000/notification/update",
      updateNotification
    );
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/loggedInUser")
      .then((res) => setCurrentUser(res.data));
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      axios
        .post("http://localhost:8000/notification/currentUserNotification", {
          _id: currentUser._id,
        })
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  console.log(notifications);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold xl:mt-20">Notifications</h1>
      <div className="divide-y-2">
        {notifications &&
          notifications.map((i: Notifications, index) => (
            <div
              className={`p-2 ${
                i.read
                  ? "bg-gray-200 hover:bg-gray-300/75 text-gray-500"
                  : "bg-gray-100 hover:bg-gray-200/50"
              } cursor-pointer`}
              key={index}
              onClick={() => handleRead(i)}
            >
              <h2 className="text-2xl font-semibold">{i.title}</h2>
              <p>{i.body.message}</p>
              <div className="flex items-center">
                {i.senderUsername}{" "}
                <img
                  className="ml-2 rounded-full"
                  src={"src/img/pfps/" + i.senderAvatar}
                  width={36}
                  height={36}
                  alt=""
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationPage;
