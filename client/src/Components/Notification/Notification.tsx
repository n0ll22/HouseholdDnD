import React, { useState } from "react";

import { FaRegBell } from "react-icons/fa";
import NotificationTab from "../NotificationTab/NotificationTab";

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState([
        {
            title: "New Comrade!",
            body: "Somebody wants to be your friend!",
            date: "2024.09.09 02:00",
            read: false,
        },
        {
            title: "New Clan Invitation!",
            body: "Somebody wants to you to join their clan!",
            date: "2024.09.09 21:30",
            read: false,
        },
        {
            title: "New Clan Invitation!",
            body: "Somebody wants to you to join their clan!",
            date: "2024.09.09 22:30",
            read: false,
        },

        {
            title: "Ad From The Devs!",
            body: "Thank you for joining our companion! We are sure you are going to have a fun time!",
            date: "2023.01.24 21:30",
            read: false,
        },
    ]);

    const [notificationTab, setNotificationTab] = useState<boolean>(false);

    const handleNotificationTab = () => {
        notificationTab ? setNotificationTab(false) : setNotificationTab(true);
    };

    const handleRead = (i: number) => {
        setNotifications((prev) => {
            const newNotifications = [...prev]; // Create a copy of the previous notifications
            newNotifications[i] = { ...newNotifications[i], read: true }; // Update the specific notification
            return newNotifications; // Return the new state
        });
    };

    return (
        <>
            <div
                className={`profile fixed right-20 top-4  w-14 h-14 bg-gray-100 rounded-lg cursor-pointer text-4xl flex items-center justify-center hover:bg-gray-300 transition-all shadow-md
                    `}
                onClick={handleNotificationTab}
            >
                <FaRegBell />
            </div>
            <NotificationTab
                isActive={notificationTab}
                notifications={notifications}
                handleRead={handleRead}
                handleNotificationTab={handleNotificationTab}
            />
        </>
    );
};

export default Notification;
