import React, { useEffect, useState } from "react";
import {
  apiUrl,
  ChatRoomProp,
  MessageProp,
  MessagePropSend,
  UserProp,
} from "../types";
import axios from "axios";
import ChatMessages from "./ChatMessages";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { FaAngleUp } from "react-icons/fa";
import socket from "../socket";
import { Api } from "../../QueryFunctions";

interface Prop {
  _id: string | undefined;
  loggedInUser: UserProp;
}

const ChatRoom: React.FC<Prop> = ({ _id, loggedInUser }) => {
  const nav = useNavigate();
  const [chatRoom, setChatRoom] = useState<ChatRoomProp | null>(null);
  const [newMessage, setNewMessage] = useState<MessagePropSend>({
    chatId: "",
    content: "",
    senderId: loggedInUser._id,
  });
  useEffect(() => {
    if (_id) {
      socket.emit("join_chat", _id);

      Api().getChatById(_id, setChatRoom);
    }
  }, [_id]);

  const handleTextFormat = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); // 👈 Call it directly
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.content.trim()) return;

    const finalMessage = {
      ...newMessage,
      chatId: _id,
    };

    socket.emit("send_message", finalMessage);

    setNewMessage((prev) => ({ ...prev, content: "" }));
  };

  const otherUsers = chatRoom?.chat.participants.filter(
    (p) => p._id !== loggedInUser._id
  );

  useEffect(() => {
    // when you open a chat room

    const onReceiveMessage = (populatedMessage: MessageProp) => {
      console.log(populatedMessage);
      setChatRoom((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          messages: [...prev.messages, populatedMessage],
        };
      });
    };

    socket.on("receive_message", onReceiveMessage);

    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg w-full transition">
      {chatRoom &&
        otherUsers &&
        otherUsers?.length === 1 &&
        otherUsers?.map((otherUser) => (
          <div key={v4()} className="flex justify-between pb-4 border-b">
            <div className="flex items-center">
              <img
                className="w-16 mr-2 rounded-md"
                src={`/src/img/pfps/${otherUser?.avatar}`}
                alt=""
              />
              <p className="font-semibold text-2xl">{otherUser?.username}</p>
            </div>
            <button onClick={() => nav("/profile/chat")}>
              <FaXmark className="rounded border w-8 h-8 p-1" />
            </button>
          </div>
        ))}
      {chatRoom && otherUsers && otherUsers?.length > 1 && (
        <div>Group Chat</div>
      )}
      {chatRoom && otherUsers && (
        <ChatMessages
          messages={chatRoom.messages}
          loggedInUser={loggedInUser}
        />
      )}
      {!chatRoom && <div>Loadig chat...</div>}
      <div className="w-full border-t  pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center border rounded-md"
        >
          <textarea
            onKeyDown={(e) => handleTextFormat(e)}
            value={newMessage.content}
            onChange={(e) =>
              setNewMessage((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full h-10 p-2 resize-none"
          ></textarea>
          <button type="submit" className="">
            <FaAngleUp className="w-10 h-10 active:-translate-y-1 transition border-l" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
