import React, { useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import MessageTab from "../MessageTab/MessageTab";

const Message: React.FC = () => {
    const [messageTab, setMessageTab] = useState<boolean>(false);

    const handleMessageTab = () => {
        messageTab ? setMessageTab(false) : setMessageTab(true);
    };

    const msg = [
        {
            name: "John Doe",
            lastMessage: "I loved that movie!",
            date: "2024.09.09 01:00",
            read: false,
        },
        {
            name: "Clare Johnson",
            lastMessage: "What are you up to?",
            date: "2024.09.09 21:30",
            read: true,
        },
        {
            name: "Maria Stevenson",
            lastMessage:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae soluta in necessitatibus odio, eveniet maiores fuga at ex explicabo natus officia illum, deleniti aspernatur iusto sapiente nam, quaerat itaque quam.",
            date: "2024.09.09 21:30",
            read: true,
        },

        {
            name: "Peter Jackson",
            lastMessage:
                "I directed another fun movie, you definitely wanna check it!",
            date: "2023.01.24 21:30",
            read: true,
        },
    ];
    console.log(messageTab);

    return (
        <>
            <div
                className={`profile fixed right-36 top-4 w-14 h-14 bg-gray-100 rounded-lg cursor-pointer text-4xl flex items-center justify-center hover:bg-gray-300 transition-all shadow-md
                    `}
                onClick={handleMessageTab}
            >
                <FaRegMessage />
            </div>
            <MessageTab messages={msg} isActive={messageTab} />
        </>
    );
};

export default Message;
