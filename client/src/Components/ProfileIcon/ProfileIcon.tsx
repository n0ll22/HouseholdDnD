import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  avatar: string;
};

const ProfileIcon: React.FC<Props> = ({ avatar }) => {
  const [profileTab, setProfileTab] = useState<boolean>(false);
  const nav = useNavigate();

  const handleTab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "profile_icon":
        setProfileTab((prev) => !prev);
        return;
      case "nav_to_profile":
        nav("/profile/info");
        setProfileTab(false);
        return;
      case "open_messages":
        return;
      case "open_notifications":
        return;
    }
  };

  return (
    <>
      <div
        className={`fixed right-4 top-4 w-14 h-14 bg-gray-100 rounded-lg
        cursor-pointer flex items-center justify-center hover:bg-gray-300
        transition-all shadow-md bg-cover bg-center`}
        id="profile_icon"
        style={{
          backgroundImage: `url("/src/img/pfps/${avatar}")`,
        }}
        onClick={(e) => handleTab(e)}
      ></div>
      {profileTab ? (
        <div
          className="absolute z-30 top-20 right-4 rounded-md bg-white w-64 transition-all space-y-2"
          onMouseLeave={() => setProfileTab(false)}
          id="profile_tab"
        >
          <p
            className="hover:bg-gray-200 p-2 rounded-md"
            id="nav_to_profile"
            onClick={(e) => handleTab(e)}
          >
            Profile
          </p>
          <p
            id="open_messsages"
            className="hover:bg-gray-200 p-2 rounded-md"
            onClick={(e) => handleTab(e)}
          >
            Messages
          </p>
          <p
            id="open_notifications"
            className="hover:bg-gray-200 p-2 rounded-md"
            onClick={(e) => handleTab(e)}
          >
            Notifications
          </p>
        </div>
      ) : null}
    </>
  );
};

export default ProfileIcon;
