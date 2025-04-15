import React, { FormEvent, useEffect, useState } from "react";
import { apiUrl, FriendshipProp, UserProp } from "../../types";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import socket from "../../socket";
import { useAuth } from "../../Auth/useAuth";
import BlockedUsers from "./BlockedUsers";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

const Options: React.FC = (): JSX.Element => {
  const { loggedInUser } = useOutletContext<{ loggedInUser: UserProp }>();
  const { getLoggedIn } = useAuth();
  const [warning, setWarning] = useState<JSX.Element | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<FriendshipProp[]>([]);
  const [newEmail, setNewEmail] = useState<{ input: string; render: string }>({
    input: "",
    render: "",
  });
  const [newPassword, setNewPassword] = useState<{
    currentPassword: string;
    password: string;
    passwordAgain: string;
  }>({
    currentPassword: "",
    password: "",
    passwordAgain: "",
  });
  const [message, setMessage] = useState<{ message: string; error: string }>({
    message: "",
    error: "",
  });
  const nav = useNavigate();

  const handleUnblockUser = (id: string, receiverId: string) => {
    socket.emit("answer_friendRequest", {
      id,
      status: "refused",
      senderId: loggedInUser._id,
      receiverId,
    });
    setBlockedUsers((prev) =>
      prev.filter((p) => p.blockedBy !== loggedInUser._id)
    );
  };

  const handleNewPassword = async (e: FormEvent) => {
    e.preventDefault();

    await axios
      .put(apiUrl + "/user/newPassword/" + loggedInUser._id, {
        password: newPassword,
      })
      .then((res) => {
        setMessage({ message: res.data.message, error: "" });
        setNewEmail((prev) => ({ ...prev, render: res.data.email }));
      })
      .catch((err) =>
        setMessage({ message: "", error: err.response.data.error })
      );
  };

  const handleNewEmail = async (e: FormEvent) => {
    e.preventDefault();

    await axios
      .put(apiUrl + "/user/newEmail/" + loggedInUser._id, {
        email: newEmail.input,
      })
      .then((res) => {
        setMessage({ message: res.data.message, error: "" });
        setNewEmail((prev) => ({ ...prev, render: res.data.email }));
      })
      .catch((err) =>
        setMessage({ message: "", error: err.response.data.error })
      );
  };

  const handleDeleteAccount = async () => {
    await axios
      .put(apiUrl + "/user/deleteAccount/" + loggedInUser._id)
      .then(() => {
        getLoggedIn();
      })
      .catch((err) => setMessage(err.response.data));

    nav("/");
    window.location.reload();
  };

  console.log(newPassword);

  const handleWarining = () => {
    setWarning(
      <div className="absolute top-0 left-0 w-screen h-screen bg-gray-900/50">
        <div className="flex w-full h-full items-center justify-center">
          <div className="bg-white text-center p-4 rounded-lg space-y-10">
            <h2 className="text-2xl font-bold">Are you sure?</h2>
            <p>Do you really wish to delete your account?</p>
            <div className="flex w-full justify-center space-x-10 text-center">
              <p
                onClick={handleDeleteAccount}
                className="cursor-pointer w-12 py-1 rounded-md border border-red-500 bg-red-300 text-white font-bold"
              >
                Yes
              </p>
              <p
                onClick={() => setWarning(null)}
                className="cursor-pointer w-12 py-1 rounded-md border border-green-500 bg-green-300 text-white font-bold"
              >
                No
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (loggedInUser._id) {
      axios
        .get(apiUrl + `/friendship/getBlocked/${loggedInUser._id}`)
        .then((res: AxiosResponse<FriendshipProp[]>) => {
          const filteredData = res.data.filter(
            (r: FriendshipProp) => r.status === "blocked"
          );
          setBlockedUsers(filteredData);
          console.log(filteredData);
        });

      setNewEmail((prev) => ({ ...prev, render: loggedInUser.email }));
    }
  }, [loggedInUser]);

  useEffect(() => {
    socket.on("receive_friendRequest_answer", handleUnblockUser);

    return () => {
      socket.off("receive_friendRequest_answer");
    };
  }, []);

  console.log(window.innerHeight);

  return (
    <main className="flex flex-col w-full items-start p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-10">Options</h1>

      <p className="text-xl font-semibold h-10">
        {(message.message && message.message) ||
          (message.error && message.error)}
      </p>

      <div className="divide-y-2">
        {loggedInUser._id && (
          <>
            <BlockedUsers
              blockedUsers={blockedUsers}
              handleUnblockUser={handleUnblockUser}
              loggedInUserId={loggedInUser._id}
            />

            <ChangeEmail
              email={newEmail}
              setEmail={setNewEmail}
              handleNewEmail={handleNewEmail}
            />

            <ChangePassword
              password={newPassword}
              setPassword={setNewPassword}
              handleNewPassword={handleNewPassword}
            />
          </>
        )}
        <div className="py-10">
          <button
            onClick={handleWarining}
            className="p-2  border bg-white rounded-md hover:text-white hover:bg-red-500 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
      {warning && warning}
    </main>
  );
};

export default Options;
