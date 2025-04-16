import React, { Dispatch, SetStateAction } from "react";
import { EditUserProp } from "../Profile/Profile";
import AvatarSelector from "../../AvatarSelector/AvatarSelector";
import { UserProp } from "../../types";

interface Props {
  setEditLogo: Dispatch<SetStateAction<EditUserProp>>;
  handleScroll: () => void;
  handleAvatarChange: () => void;
  loggedInUser: UserProp;
  editLogo: { avatar: boolean; banner: boolean };
  isEditing: { avatar: boolean; banner: boolean };
  icon: JSX.Element;
}

const UserAvatar: React.FC<Props> = ({
  loggedInUser,
  editLogo,
  isEditing,
  icon,
  setEditLogo,
  handleAvatarChange,
  handleScroll,
}) => {
  return (
    <div
      className="w-40 h-40 bg-cover bg-center flex-shrink-0"
      style={{
        backgroundImage: `url("/src/img/pfps/${loggedInUser.avatar}")`,
      }}
      onMouseEnter={() =>
        setEditLogo((prevState) => ({
          ...prevState,
          avatar: true,
        }))
      }
      onMouseLeave={() =>
        setEditLogo((prevState) => ({
          ...prevState,
          avatar: false,
        }))
      }
    >
      {editLogo.avatar && (
        <div
          className={` ${
            editLogo.avatar ? "opacity-100" : "opacity-10"
          } text-8xl flex justify-center z-20 items-center hover:bg-gray-900/50 text-white w-full h-full cursor-pointer transition-all duration-100`}
          onClick={handleAvatarChange}
          onScrollCapture={handleScroll}
        >
          {icon}
        </div>
      )}
      {isEditing.avatar && <AvatarSelector _id={loggedInUser._id} />}
    </div>
  );
};

export default UserAvatar;
