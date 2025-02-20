import React from "react";

type Props = {
    messages: {
        name: string;
        lastMessage: string;
        date: string;
        read: boolean;
    }[];

    isActive: boolean;
};

const MessageTab: React.FC<Props> = ({ messages, isActive }) => {
    console.log(isActive);
    return (
        <div
            className={`fixed top-4 w-80 z-20 h-fit max-h-[500px] right-52 sm:top-24 sm:right-0 rounded-lg bg-gray-100 overflow-auto divide-y shadow-lg shadow-gray-900/30 ${
                isActive
                    ? "translate-x-0 translate-y-0 scale-100"
                    : "translate-x-44 sm:translate-x-14 -translate-y-40 sm:-translate-y-52 scale-0"
            } transition-all`}
        >
            <h3 className="py-2 pl-2 text-xl font-semibold border-b ">
                Messages
            </h3>
            {messages
                .sort((a, b) =>
                    b.date.localeCompare(a.date, undefined, {
                        sensitivity: "base",
                    })
                )
                .map((i, k) => (
                    <div
                        key={k}
                        className={`pl-2 hover:bg-gray-200 ${
                            i.read ? "bg-gray-300" : "bg-gray-100"
                        }`}
                        onClick={() => (messages[k].read = true)}
                    >
                        <a href="">
                            <h4 className="py-4 text-lg font-medium">
                                {i.name}
                            </h4>
                            <p className="py-2">{i.lastMessage}</p>
                            <p className="text-sm py-2 text-gray-400">
                                {i.date}
                            </p>
                        </a>
                    </div>
                ))}
        </div>
    );
};

export default MessageTab;
