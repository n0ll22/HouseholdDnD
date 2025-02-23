import { useEffect, useRef, useState } from "react";
import { formatDate } from "../../DateFormat";
import { useOutletContext } from "react-router-dom";
import { User } from "../types";

const Chat = () => {
    const { loggedInUser, friendsData } = useOutletContext<{
        loggedInUser: User;
        friendsData: User[];
    }>();

    const [selectedChat, setSelectedChat] = useState<string>("chat1");
    const [inputData, setInputData] = useState<string>("");
    const [isNewChat, setIsNewChat] = useState(
        <div className="absolute"></div>
    );
    const scrollToBottom = useRef<HTMLElement | null>(null);

    const handleSelectedChat = (id: string) => {
        setSelectedChat(id);
    };

    const handleMessageSend = (id: string) => {
        if (inputData) {
            const pushMessage = {
                senderId: loggedInUser._id,
                date: formatDate(),
                content: inputData,
                nickname:
                    dummyData.find((v) => v.chatId === selectedChat)?.comrade
                        .username || "",
            };

            setDummyData((prevData) =>
                prevData.map((chat) =>
                    chat.chatId === id
                        ? {
                              ...chat,
                              messages: [...chat.messages, pushMessage], // Push the new message
                          }
                        : chat
                )
            );
        }
        // Optionally clear the input field after sending
        setInputData("");
    };

    const dummyData = [];

    const handleNewChat = () => {
        const createNewChat = (id: string) => {};
        if (!isNewChat) {
            return setIsNewChat(
                <div className="ml-10 rounded-lg absolute bg-gray-100 shadow-md">
                    <button
                        className="py-4 px-2"
                        onClick={() => setIsNewChat(null)}
                    >
                        Cancel
                    </button>
                    {friendsData.map((i, key) => (
                        <div
                            className="p-2"
                            key={key}
                            onClick={() => createNewChat(i._id)}
                        >
                            {i.username}
                        </div>
                    ))}
                </div>
            );
        }
        if (isNewChat) {
            return setIsNewChat(null);
        }
    };

    useEffect(() => {
        if (scrollToBottom.current) {
            scrollToBottom.current.scrollTop =
                scrollToBottom.current.scrollHeight;
        }
    }, [dummyData, selectedChat]);

    return (
        <div className="pt-12 grid grid-cols-3">
            {isNewChat}
            <div className="divide-y">
                <div>
                    <button
                        className={`flex items-center space-x-2 pb-2 pt-2 rounded-md ml-10
                         hover:bg-gray-200"
                        `}
                        onClick={handleNewChat}
                    >
                        New Chat!
                    </button>
                </div>
                {dummyData.map((i) => (
                    <div
                        key={i.chatId}
                        className={`flex items-center space-x-2 pb-2 pt-2 rounded-md ml-10 ${
                            selectedChat === i.chatId ? "bg-gray-200" : ""
                        }`}
                        onClick={() => handleSelectedChat(i.chatId)}
                    >
                        <img
                            width={64}
                            height={64}
                            src={`/src/img/pfps/${i.comrade.avatar}`}
                            alt=""
                            className="rounded-lg mx-2"
                        />
                        <div>
                            <div>{i.comrade.username}</div>
                            <div className="text-gray-400">
                                {i.messages[0].content.length > 20
                                    ? i.messages[0].content.substring(0, 20) +
                                      "..."
                                    : i.messages[0].content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="col-span-2 mx-10">
                <div
                    ref={scrollToBottom}
                    className="rounded-xl p-4  overflow-y-auto"
                    style={{
                        boxShadow: " inset 0 0 5px 1px rgb(0,0,0,0.1)",
                        height: "calc(100vh - 256px)",
                    }}
                >
                    {dummyData
                        .find((i) => i.chatId === selectedChat)
                        ?.messages.sort((a, b) => {
                            const dateA = new Date(a.date).getTime();
                            const dateB = new Date(b.date).getTime();
                            return dateA - dateB;
                        })
                        .map((i, index) => (
                            <div
                                className={`flex flex-col space-y-2  ${
                                    loggedInUserId === i.senderId
                                        ? "items-end text-right"
                                        : "items-start"
                                }`}
                                key={index}
                            >
                                <div
                                    className={`rounded-lg p-2 shadow-md min-w-32 ${
                                        loggedInUserId === i.senderId
                                            ? "bg-red-400 text-white"
                                            : "border border-gray-400"
                                    }`}
                                >
                                    <div className="mb-4 font-medium">
                                        {i.nickname}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: i.content.replace(
                                                /\n/g,
                                                "</br>"
                                            ),
                                        }}
                                    />
                                </div>
                                <div className="text-sm text-gray-400">
                                    {i.date}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="py-4 flex justify-between">
                    <textarea
                        className="w-11/12 px-4 py-2 rounded-full max-h-10 min-h-10 bg-gray-100"
                        style={{
                            boxShadow: " inset 0 0 3px 1px rgb(0,0,0,0.1)",
                        }}
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                    >
                        {" "}
                    </textarea>
                    <button
                        onClick={() => handleMessageSend(selectedChat)}
                        className="rounded-full h-10 w-10 bg-red-400 text-white shadow"
                    >
                        ^
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
