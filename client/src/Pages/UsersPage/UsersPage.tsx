import React from "react";

import { Outlet } from "react-router-dom";
import useGet from "../../Hooks/useGet";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { User } from "../../Components/types";

const UsersPage: React.FC = () => {
  const {
    data: userData,
    error,
    pending,
  } = useGet<User[]>("http://localhost:8000/user/");

  const {
    data: loggedInUser,
    error: loggedInUserError,
    pending: loggedInUserPending,
  } = useGet<User>("http://localhost:8000/user/loggedInUser");

  console.log("users", userData);
  console.log("you", loggedInUser);
  return (
    <>
      {userData && loggedInUser ? (
        <Outlet context={{ userData, loggedInUser }} />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <LoadingSpinner loading={pending && loggedInUserPending} />
        </div>
      )}
      {error && <div>Error {error.message}</div>}
      {loggedInUserError && <div>Error {loggedInUserError.message}</div>}
    </>
  );
};

export default UsersPage;
