import React from "react";
import ProfileIcon from "../ProfileIcon/ProfileIcon";

import { useUser } from "../Auth/UserContext";

const Social: React.FC = () => {
  const loggedInUser = useUser();

  return (
    <div className="fixed right-0 top-1">
      {loggedInUser && <ProfileIcon avatar={loggedInUser?.avatar} />}
    </div>
  );
};

export default Social;
