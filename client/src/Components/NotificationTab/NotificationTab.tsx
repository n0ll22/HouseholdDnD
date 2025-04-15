import React from "react";
import { Link } from "react-router-dom";

type Props = {
    notifications: {
        title: string;
        body: string;
        date: string;
        read: boolean;
    }[];
    handleRead: (i: number) => void;
    handleNotificationTab: () => void;
    isActive: boolean;
};

const NotificationTab: React.FC<Props> = ({
    notifications,
    isActive,
    handleRead,
    handleNotificationTab,
}) => {
    return (
        <div
            className={`fixed top-4 w-80 z-30 h-fit max-h-[500px] right-36 sm:top-24 sm:right-0 rounded-lg bg-gray-100 overflow-auto divide-y shadow-lg shadow-gray-900/30 ${
                isActive
                    ? "translate-x-0 translate-y-0 scale-100"
                    : "translate-x-44 sm:translate-x-14 -translate-y-40 sm:-translate-y-52 scale-0"
            } transition-all`}
        >
            <Link to="/notifications" onClick={handleNotificationTab}>
                <p className="py-2 pl-2 text-xl hover:bg-gray-200 font-semibold">
                    Notifications
                </p>
            </Link>
            {notifications
                .sort((a, b) =>
                    b.date.localeCompare(a.date, undefined, {
                        sensitivity: "base",
                    })
                )
                .map((i, index) => (
                    <div
                        key={index}
                        className={`pl-2 hover:bg-gray-200 ${
                            i.read ? "bg-gray-300" : "bg-gray-100"
                        }`}
                        onClick={() => handleRead(index)}
                    >
                        <div>
                            <h4 className="py-4 text-lg font-medium">
                                {i.title}
                            </h4>
                            <p className="py-2">{i.body}</p>
                            <p className="text-sm py-2 text-gray-400">
                                {i.date}
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default NotificationTab;
