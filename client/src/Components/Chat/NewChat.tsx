import React, { FormEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { apiUrl, User } from "../types";
import { FaXmark } from "react-icons/fa6";
import axios, { all } from "axios";

type Props = {
  loggedInUser: User;
  comrades: User[];
};

const NewChat: React.FC<Props> = ({ loggedInUser, comrades }) => {
  const [input, setInput] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);

  const handleAddParticipants = (_id: string) => {
    const alreadyAdded = participants.find((i) => i === _id);

    if (alreadyAdded) return;

    setParticipants((prev) => [...prev, _id]);
    setInput(() => "");
  };

  const handleRemoveParticipants = (_id: string) => {
    const filteredParticipants = participants.filter((i) => i !== _id);
    setParticipants(() => filteredParticipants);
  };

  const handleNewChat = (e: FormEvent) => {
    e.preventDefault();

    const allParticipants = participants;
    allParticipants.push(loggedInUser._id);

    console.log(allParticipants);

    axios
      .post(apiUrl + "/chat/", { participants: allParticipants })
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.error(err);
      });

    setParticipants(() => []);
    setInput(() => "");
  };

  console.log(participants);
  return (
    <form className="w-1/2" onSubmit={(e) => handleNewChat(e)}>
      <input
        className="p-2 rounded-md border border-black"
        type="text"
        value={input}
        placeholder="New Chat"
        onChange={(e) => setInput(e.target.value)}
      />
      <div>
        <div className="flex space-x-4">
          {participants &&
            comrades &&
            comrades
              .filter((i) => participants.includes(i._id))
              .map((i, index) => (
                <div
                  className="flex items-center border border-black p-2 rounded-md hover:bg-red-400 hover:text-white hover:border-red-600 space-x-2 transition cursor-pointer"
                  key={index}
                  onClick={() => handleRemoveParticipants(i._id)}
                >
                  <p>{i.username}</p>

                  <FaXmark />
                </div>
              ))}
        </div>
        {participants && (
          <div>
            <button
              className="flex items-center border border-black p-2 rounded-md hover:bg-green-400 hover:text-white hover:border-green-600 space-x-2 transition"
              type="submit"
            >
              Create {participants.length > 1 ? "Group Chat" : "Private Chat"}
            </button>
          </div>
        )}
      </div>
      <div className={`${input ? "w-full border" : ""}`}>
        {input &&
          comrades
            .filter((i) =>
              i.username.toLowerCase().includes(input.toLowerCase())
            )
            .map((i, index) => (
              <div
                className="p-2"
                key={index}
                onClick={() => handleAddParticipants(i._id)}
              >
                {i.username}
              </div>
            ))}
      </div>
    </form>
  );
};

export default NewChat;
