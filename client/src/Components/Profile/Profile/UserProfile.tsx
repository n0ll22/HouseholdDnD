import React, { useState } from "react";

import axios from "axios";
import { FaEdit } from "react-icons/fa";
import UserBanner from "../Banner/UserBanner";
import { useOutletContext } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import UserAvatar from "../Avatar/UserAvatar";
import { User } from "../../types";
import UserUsername from "../Username/UserUsername";
import UserDescription from "../Description/UserDescription";

export interface EditUserProp {
    username: boolean;
    avatar: boolean;
    description: boolean;
    banner: boolean;
}

const UserProfile: React.FC = () => {
    const { userData } = useOutletContext<{ userData: User }>();

    const [icon, setIcon] = useState(<FaEdit />);

    const [isEditing, setIsEditing] = useState<EditUserProp>({
        username: false,
        avatar: false,
        description: false,
        banner: false,
    });
    const [newUserName, setNewUserName] = useState(userData.username);
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
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setNewUserName(e.target.value);
    };

    // Handle pressing Enter or losing focus to stop editing
    const handleSave = (e: React.KeyboardEvent | React.FocusEvent) => {
        if (e.type === "blur" || (e as React.KeyboardEvent).key === "Enter") {
            setIsEditing((prevState) => ({ ...prevState, username: false }));
            if (newUserName === userData.username) {
                return;
            }
            const update = { _id: userData._id, username: newUserName };
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
            <h1 className="text-4xl font-bold my-10">The Legend:</h1>
            {/*UserName Component*/}
            <UserUsername
                editLogo={editLogo}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleUsernameChange={handleUsernameChange}
                setEditLogo={setEditLogo}
                isEditing={isEditing}
                newUserName={newUserName}
                userData={userData}
            />
            {userData && (
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
                            userData={userData}
                        />
                        {/*Banner Component*/}
                        <UserBanner
                            editLogo={editLogo}
                            handleBannerColor={handleBannerColor}
                            isEditing={isEditing}
                            setEditLogo={setEditLogo}
                            userData={userData}
                        />
                    </div>
                    <div className="p-2">
                        <UserDescription description={userData.description} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserProfile;
