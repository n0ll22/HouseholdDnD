import React, { useState } from "react";

import axios from "axios";
import { FaEdit } from "react-icons/fa";
import UserBanner from "../Banner/UserBanner";
import { useOutletContext } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import UserAvatar from "../Avatar/UserAvatar";
import { UserProp } from "../../types";
import UserUsername from "../Username/UserUsername";
import UserDescription from "../Description/UserDescription";

export interface EditUserProp {
  username: boolean;
  avatar: boolean;
  description: boolean;
  banner: boolean;
}

const Profile: React.FC = () => {
  const { loggedInUser } = useOutletContext<{ loggedInUser: UserProp }>();

  const [icon, setIcon] = useState(<FaEdit />);

  const [isEditing, setIsEditing] = useState<EditUserProp>({
    username: false,
    avatar: false,
    description: false,
    banner: false,
  });
  const [newUserName, setNewUserName] = useState(loggedInUser.username);
  const [editLogo, setEditLogo] = useState<EditUserProp>({
    username: false,
    avatar: false,
    description: false,
    banner: false,
  });

  // Handle when username is clicked for editing
  const handleUsernameChange = () => {
    setIsEditing((prevState) => ({ ...prevState, username: true }));
  };

  // Handle when banner clicked for color change
  const handleBannerColor = () => {
    setIsEditing((prevState) => ({ ...prevState, banner: true }));
  };

  // Handle when avatar clicked for picture change
  const handleAvatarChange = (): void => {
    setIsEditing((prevState) => ({ ...prevState, avatar: true }));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUserName(e.target.value);
  };

  // Handle pressing Enter or losing focus to stop editing
  const handleSave = (e: React.KeyboardEvent | React.FocusEvent) => {
    if (e.type === "blur" || (e as React.KeyboardEvent).key === "Enter") {
      setIsEditing((prevState) => ({ ...prevState, username: false }));
      if (newUserName === loggedInUser.username) {
        return;
      }
      const update = { _id: loggedInUser._id, username: newUserName };
      axios
        .put("http://localhost:8000/user/updateUsername", update)
        .then(() => console.log("Saved!"))
        .catch((err) => console.error(err));
    }
  };

  // Handle Scrolling to top
  const handleScroll = () => {
    setIcon((prevIcon) =>
      prevIcon.type === FaEdit ? <FaMagnifyingGlass /> : <FaEdit />
    );
  };

  return (
    <main className="w-full p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-10">
        The Legend:
      </h1>

      {/*UserName Component*/}
      <UserUsername
        editLogo={editLogo}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleUsernameChange={handleUsernameChange}
        setEditLogo={setEditLogo}
        isEditing={isEditing}
        newUserName={newUserName}
        loggedInUser={loggedInUser}
      />
      {loggedInUser && (
        <div className="flex flex-col">
          <div className="flex w-full">
            {/*Avatar Component*/}
            <UserAvatar
              editLogo={editLogo}
              handleAvatarChange={handleAvatarChange}
              handleScroll={handleScroll}
              icon={icon}
              isEditing={isEditing}
              setEditLogo={setEditLogo}
              loggedInUser={loggedInUser}
            />
            {/*Banner Component*/}
            <UserBanner
              editLogo={editLogo}
              handleBannerColor={handleBannerColor}
              isEditing={isEditing}
              setEditLogo={setEditLogo}
              loggedInUser={loggedInUser}
            />
          </div>
          <div className="p-2">
            <UserDescription description={loggedInUser.description} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
