import React, { MouseEventHandler } from "react";
import { User } from "../../types";
import { FaEdit } from "react-icons/fa";
import { EditUserProp } from "../Profile/Profile";

interface Props {
  handleSave: (e: React.KeyboardEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUsernameChange: MouseEventHandler<HTMLHeadingElement>;
  setEditLogo: React.Dispatch<React.SetStateAction<EditUserProp>>;
  editLogo: { username: boolean };
  newUserName: string;
  loggedInUser: User;
  isEditing: { username: boolean };
}

const UserUsername: React.FC<Props> = ({
  handleSave,
  handleInputChange,
  handleUsernameChange,
  setEditLogo,
  editLogo,
  newUserName,
  isEditing,
  loggedInUser,
}) => {
  console.log(isEditing.username);
  return (
    loggedInUser && (
      <>
        {isEditing.username ? (
          <input
            type="text"
            value={newUserName}
            onChange={handleInputChange}
            onBlur={() => handleSave}
            onKeyDown={handleSave}
            className="text-4xl w-fit font-bold mb-10"
            id="username-input"
            autoFocus
          />
        ) : (
          <h2
            onClick={handleUsernameChange}
            className="flex w-fit text-4xl font-bold mb-10 rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
            id="username"
            onMouseEnter={() =>
              setEditLogo((prevState) => ({
                ...prevState,
                username: true,
              }))
            }
            onMouseLeave={() =>
              setEditLogo((prevState) => ({
                ...prevState,
                username: false,
              }))
            }
          >
            {newUserName}

            <div
              className={`${
                editLogo.username
                  ? "opacity-100 translate-x-2"
                  : "opacity-0 -translate-x-4"
              } transition-all`}
            >
              <FaEdit />
            </div>
          </h2>
        )}
      </>
    )
  );
};

export default UserUsername;
