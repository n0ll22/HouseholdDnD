import React, { useEffect, useRef } from "react";
import { MessageProp, Participant, UserProp } from "../types";
import { v4 } from "uuid";

type Props = {
  loggedInUser: UserProp;
  messages: MessageProp[];
};

const ChatMessages: React.FC<Props> = ({ messages, loggedInUser }) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the scrollable container

  // Scroll to the bottom when the chat is opened
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // Set scroll to the bottom
    }
  }, []); // Trigger only when the component is mounted

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [messages]); // Trigger whenever messages change

  return (
    <div
      ref={chatContainerRef}
      className="overflow-y-auto space-y-4 h-96 w-full p-2" // Ensure the container is scrollable
    >
      {messages &&
        messages.map((m) => (
          <div
            key={v4()}
            className={`flex w-full ${
              m.senderId._id === loggedInUser._id ? "flex-row-reverse" : ""
            }`}
          >
            <img
              className={`w-10 h-10 ${
                m.senderId._id === loggedInUser._id ? "ml-2" : "mr-2"
              }  rounded-md`}
              src={`/src/img/pfps/${m.senderId.avatar}`}
              alt=""
            />
            <p
              className={`whitespace-pre-wrap flex items-center min-h-10 max-w-96 p-2 
            rounded-md border overflow-hidden break-all ${
              m.senderId._id === loggedInUser._id
                ? "bg-white"
                : "bg-red-400 text-white border-none"
            }`}
            >
              {m.content}
            </p>
          </div>
        ))}
    </div>
  );
};

export default ChatMessages;
