import React, { Dispatch, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatProp, FriendshipProp, Participant, UserProp } from "../types";
import socket from "../socket";
import { v4 } from "uuid";

type Props = {
  chatRooms: ChatProp[];
  loggedInUser: UserProp;
  setChatDropdown: Dispatch<React.SetStateAction<boolean>>;
  setChatRooms: Dispatch<React.SetStateAction<ChatProp[]>>;
};

const ChatRoomList: React.FC<Props> = ({
  chatRooms,
  loggedInUser,
  setChatDropdown,
  setChatRooms,
}) => {
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>(
    {}
  );
  const nav = useNavigate();

  useEffect(() => {
    const handleNewMessage = ({
      chatId,
      senderId,
      content,
    }: {
      chatId: string;
      senderId: string;
      content: string;
    }) => {
      if (senderId !== loggedInUser._id) {
        setUnreadMessages((prev) => ({ ...prev, [chatId]: true }));
      }

      setChatRooms((prev) =>
        prev.map((chatRoom) =>
          chatRoom._id === chatId
            ? {
                ...chatRoom,
                latest: {
                  ...chatRoom.latest,
                  senderId,
                  content,
                },
              }
            : chatRoom
        )
      );
    };

    const handleReceiveStatus = (user: Participant) => {
      console.log(user);
      setChatRooms((prevRooms) =>
        prevRooms.map((room) => {
          const updatedParticipants = room.participants.map((p) =>
            p._id === user._id ? { ...p, ...user } : p
          );
          return { ...room, participants: updatedParticipants };
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receive_status", handleReceiveStatus);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("receive_status");
    };
  }, [loggedInUser._id, setChatRooms]);

  console.log(chatRooms);

  const getUsername = (chatRoom: ChatProp) => {
    const senderId = chatRoom.latest?.senderId;

    if (
      typeof senderId === "object" &&
      senderId !== null &&
      "username" in senderId
    ) {
      return (senderId as Participant).username;
    }

    return (
      chatRoom.participants.find(
        (p: FriendshipProp["otherUser"]) => p._id === senderId
      )?.username || "Unknown"
    );
  };

  return (
    <div className="py-2" onClick={() => setChatDropdown(false)}>
      {chatRooms.map((chatRoom) => {
        const participant = chatRoom.participants.find(
          (p) => p._id !== loggedInUser._id
        );
        if (!participant) return null;

        return (
          <div
            key={v4()}
            className="hover:bg-slate-200 cursor-pointer rounded-lg flex items-center py-2"
            onClick={() => {
              nav(`/profile/chat/${chatRoom._id}`);
            }}
          >
            <div
              style={{
                backgroundImage: `url(/src/img/pfps/${participant.avatar})`,
              }}
              className="rounded-md mx-2 w-16 h-16 bg-center bg-cover"
            >
              <div className="flex flex-row-reverse w-full h-full items-end">
                <div
                  className={`w-4 h-4 translate-x-1 translate-y-1 rounded-full ${
                    participant.status === "online"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <p className={unreadMessages[chatRoom._id] ? "font-bold" : ""}>
                  {participant.username}
                </p>
              </div>
              {chatRoom.latest && (
                <p className="text-sm text-gray-500">
                  <span className="font-bold">{getUsername(chatRoom)}:</span>{" "}
                  {chatRoom.latest.content.length > 15
                    ? `${chatRoom.latest.content.slice(0, 12)}...`
                    : chatRoom.latest.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomList;
