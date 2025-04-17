import { useEffect, useState, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { ChatProp, FriendshipProp, MessageProp, UserProp } from "../types";

import ChatRoom from "./ChatRoom";
import ChatRoomList from "./ChatRoomList";
import NewChat from "./NewChat.tsx";
import { FaUser } from "react-icons/fa6";
import socket from "../socket";
import { Api } from "../../QueryFunctions.tsx";
//import { useNotification } from "../Notification/Notification.tsx";

const Chat = () => {
  const { id } = useParams();
  const { loggedInUser, friendships } = useOutletContext<{
    loggedInUser: UserProp;
    friendships: FriendshipProp[];
  }>();

  const [chatRooms, setChatRooms] = useState<ChatProp[]>([]);
  const [newChatInput, setNewChatInput] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showDropdown, setShowDropdown] = useState(false);

  //const { notify } = useNotification();

  const friends = friendships
    ? friendships
        ?.filter((f) => f.status === "accepted")
        .map((f) => f.otherUser)
    : [];

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    if (loggedInUser) {
      Api().getByParticipants(loggedInUser, setChatRooms);
    }
    socket.on("receive_new_chat", (chatRoom: ChatProp) => {
      setChatRooms((prev) => [...prev, chatRoom]);
    });

    socket.on("newMessage", (message: MessageProp) => {
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === message.chatId
            ? { ...room, latestMessage: message.content }
            : room
        )
      );
    });

    window.addEventListener("resize", handleResize);

    return () => {
      socket.off("receive_new_chat");
      socket.off("newMessage");
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const isDesktop = windowWidth > 1080;

  console.log(chatRooms);

  return (
    <main
      className={`animate-fadeInFast p-10 ${
        isDesktop ? "grid grid-cols-4 space-x-2" : "flex flex-col"
      }`}
    >
      {isDesktop ? (
        <div className="col-span-1">
          <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-10">
            Chats
          </h1>
          <NewChat
            newChatInput={newChatInput}
            setNewChatInput={setNewChatInput}
            loggedInUser={loggedInUser}
            friends={friends}
            chatRooms={chatRooms}
          />
          {!newChatInput && (
            <ChatRoomList
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              loggedInUser={loggedInUser}
              setChatDropdown={setShowDropdown}
            />
          )}
        </div>
      ) : (
        <div
          className="my-2 p-2 flex w-fit justify-center border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="flex items-center">
            <FaUser className="w-8 h-8 mr-2" /> <span>Chats</span>
          </div>
        </div>
      )}

      {!isDesktop && showDropdown && (
        <div
          className="absolute w-full z-10 left-0 p-2 bg-gray-100 overflow-y-auto"
          style={{ top: "220px", height: "calc(100vh - 220px)" }}
        >
          <NewChat
            newChatInput={newChatInput}
            setNewChatInput={setNewChatInput}
            loggedInUser={loggedInUser}
            friends={friends}
            chatRooms={chatRooms}
          />
          {!newChatInput && (
            <ChatRoomList
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              loggedInUser={loggedInUser}
              setChatDropdown={setShowDropdown}
            />
          )}
        </div>
      )}

      <div
        className={`${isDesktop ? "col-span-3" : "flex w-full"}`}
        style={{ height: isDesktop ? "calc(100vh - 16rem)" : "" }}
      >
        {id ? (
          <ChatRoom _id={id} loggedInUser={loggedInUser} />
        ) : (
          <div className="text-center w-full my-auto text-gray-500 text-lg">
            Select a room to start chatting
          </div>
        )}
      </div>
    </main>
  );
};

export default Chat;
