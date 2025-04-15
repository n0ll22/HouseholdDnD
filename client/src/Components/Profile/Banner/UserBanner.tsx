import React, { Dispatch, SetStateAction } from "react";
import { User } from "../../types";
import BannerSelector from "./BannerSelector";
import { EditUserProp } from "../Profile/Profile";

interface Props {
  setEditLogo: Dispatch<SetStateAction<EditUserProp>>;
  handleBannerColor: () => void;
  loggedInUser: User;
  editLogo: { avatar: boolean; banner: boolean };
  isEditing: { avatar: boolean; banner: boolean };
}

const UserBanner: React.FC<Props> = ({
  loggedInUser,
  editLogo,
  isEditing,
  setEditLogo,
  handleBannerColor,
}) => {
  return (
    <div
      className={`${
        editLogo.banner ? `${loggedInUser.banner} ` : `${loggedInUser.banner} `
      } flex w-full cursor-pointer`}
      onMouseEnter={() => {
        setEditLogo((prevState) => ({
          ...prevState,
          banner: true,
        }));
      }}
      onMouseLeave={() => {
        setEditLogo((prevState) => ({
          ...prevState,
          banner: false,
        }));
      }}
      onClick={handleBannerColor}
    >
      {isEditing.banner && <BannerSelector isActive={isEditing.banner} />}

      <p className="ml-10 mt-10 text-white drop-shadow">
        LVL: {loggedInUser.lvl}
      </p>
      <p className="ml-10 mt-10 text-white drop-shadow">
        Today's Tasks: {loggedInUser.taskToday.length || 0}
      </p>
    </div>
  );
};

export default UserBanner;
