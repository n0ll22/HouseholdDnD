import { useEffect, useRef, useState } from "react";
import { formatDate } from "../../DateFormat";

const Chat = () => {
  const [dummyData, setDummyData] = useState([
    {
      chatId: "chat1",
      comrade: {
        _id: "6784a0f9ac7ef5e54d380d45",
        username: "Asdman100",
        lvl: 3,
        avatar: "pfp6.jpg",
      },
      messages: [
        {
          senderId: "6784a0f9ac7ef5e54d380d45",
          date: "2025.02.20 10:11:54",
          content: "Hi! My name is Szabyest!",
          nickname: "Asdman100",
        },
        {
          senderId: "6784a0afac7ef5e54d380d3d",
          date: "2025.02.20 10:12:36",
          content: "Hi! Do I know you? 🫡",
          nickname: "Pookiebear ❤️",
        },
      ],
    },
    {
      chatId: "chat2",
      comrade: {
        avatar: "pfp1.jpg",
        username: "Vinnix",
        lvl: 3,
        _id: "6784a1a7ac7ef5e54d380d56",
      },
      messages: [
        {
          senderId: "6784a1a7ac7ef5e54d380d56",
          date: "2025.02.20 10:12:07",
          content: "Wassup buddy?",
          nickname: "Vinnix",
        },
        {
          senderId: "6784a1a7ac7ef5e54d380d56",
          date: "2025.02.20 11:22:37",
          content: "Sorry, ma dick fell off!",
          nickname: "Vinnix",
        },
        {
          senderId: "6784a0afac7ef5e54d380d3d",
          date: "2025.02.20 10:30:50",
          content: "Huh?",
          nickname: "N1LL",
        },
        {
          senderId: "6784a0afac7ef5e54d380d3d",
          date: "2025.02.20 10:20:53",
          content: "Hi! Everything's fine bro! What's poppin?",
          nickname: "N1LL",
        },
        {
          senderId: "6784a0afac7ef5e54d380d3d",
          date: "2025.02.20 11:30:50",
          content: "Lmao no way XDDD",
          nickname: "N1LL",
        },
        {
          senderId: "6784a1a7ac7ef5e54d380d56",
          date: "2025.02.20 11:31:37",
          content: "ikr? xd unbelieveable...",
          nickname: "Vinnix",
        },
        {
          senderId: "6784a1a7ac7ef5e54d380d56",
          date: "2025.02.20 11:32:17",
          content:
            "I had to go to see the doctor so he can stitch ma cock back together xd. \n Ma wife is full of shit now xddd",
          nickname: "Vinnix",
        },
        {
          senderId: "6784a0afac7ef5e54d380d3d",
          date: "2025.02.20 11:32:43",
          content: "AIN'T\nNO\nWAY!",
          nickname: "N1LL",
        },
      ],
    },
  ]);

  const loggedInUserId = "6784a0afac7ef5e54d380d3d";
  const [selectedChat, setSelectedChat] = useState<string>("chat1");
  const [inputData, setInputData] = useState<string>("");
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const handleSelectedChat = (id: string) => {
    setSelectedChat(id);
  };

  const handleMessageSend = (id: string) => {
    if (inputData) {
      const pushMessage = {
        senderId: loggedInUserId,
        date: formatDate(),
        content: inputData,
        nickname:
          dummyData.find((v) => v.chatId === selectedChat)?.comrade.username ||
          "",
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

  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollTop = scrollToBottom.current.scrollHeight;
    }
  }, [dummyData, selectedChat]);

  return (
    <div className="pt-12 grid grid-cols-3">
      <div className="divide-y">
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
                  ? i.messages[0].content.substring(0, 20) + "..."
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
                  <div className="mb-4 font-medium">{i.nickname}</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: i.content.replace(/\n/g, "</br>"),
                    }}
                  />
                </div>
                <div className="text-sm text-gray-400">{i.date}</div>
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
