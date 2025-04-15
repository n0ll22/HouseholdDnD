import React, { useState, useEffect, useContext } from "react";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { apiUrl, User } from "../types";
import { useOutletContext } from "react-router-dom";
import useGet from "../../Hooks/useGet";

const Social: React.FC = () => {
  const { data: loggedInUser } = useGet(apiUrl + "/user/loggedInUser");

  //console.log(loggedInUser);

  return (
    <div className="fixed right-0 top-1">
      <ProfileIcon avatar={loggedInUser?.avatar} />
    </div>
  );
};

export default Social;
