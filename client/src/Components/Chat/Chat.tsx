import React, { useEffect, useState } from "react";
import NewChat from "./NewChat";
import { useOutletContext } from "react-router-dom";
import { apiUrl, User } from "../types";
import { io } from "socket.io-client";
import axios from "axios";

type Props = {};

const Chat = (props: Props) => {
  const { loggedInUser, comrades } = useOutletContext<{
    loggedInUser: User;
    comrades: User[];
  }>();

  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl + "/chat/" + loggedInUser._id)
      .then((res) => setChatRooms(res.data));

    const socket = io("http://localhost:8000"); // Replace with your server URL

    // Listen for new chat room creation
    socket.on("newChatRoom", (chatRoom) => {
      setChatRooms((prev) => [...prev, chatRoom]); // Update the state with the new chat room
    });

    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, [loggedInUser]);

  console.log("Chatrooms:   ", chatRooms);

  return (
    <div>
      <NewChat loggedInUser={loggedInUser} comrades={comrades} />
      <div>
        {chatRooms.map((chatRoom) => {
          // Filter out the participant with the same ID as the loggedInUser
          const filteredParticipants = chatRoom.participants.filter(
            (participant: User) => participant._id !== loggedInUser._id
          );

          // Render the chat room if there are any participants left after filtering
          return (
            <div key={chatRoom._id}>
              {filteredParticipants.map((participant: User) => (
                <span>{participant.username}</span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
