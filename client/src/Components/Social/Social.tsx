import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import Notification from "../Notification/Notification";
import useGet from "../../Hooks/useGet";
import { User } from "../types";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Social: React.FC = () => {
  const {
    data: loggedInUser,
    pending: loggedInUserPending,
    error: loggedInUserError,
  } = useGet<User>("http://localhost:8000/user/loggedInUser");

  const [delayedPending, setDelayedPending] = useState(true);

  useEffect(() => {
    // Simulate a 2-second delay for the spinner
    const timeout = setTimeout(() => {
      setDelayedPending(loggedInUserPending);
    }, 500);

    return () => clearTimeout(timeout); // Clear timeout when component unmounts
  }, [loggedInUserPending]);

  return (
    <div className="fixed right-0 top-1">
      {loggedInUser && !delayedPending && (
        <>
          <ProfileIcon avatar={loggedInUser.avatar} />
          <Notification />
          <Message friends={loggedInUser.comrades} />
        </>
      )}
      {delayedPending && (
        <div className="absolute top-4 right-4">
          <LoadingSpinner loading={delayedPending} />
        </div>
      )}
      {loggedInUserError && <div>{loggedInUserError.message}</div>}
    </div>
  );
};

export default Social;
