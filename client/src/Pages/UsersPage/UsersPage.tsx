import React, { useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import useGet from "../../Hooks/useGet";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { QueryProps, UserDataProp, UserProp } from "../../Components/types";
import socket from "../../Components/socket";
import axios, { Axios, AxiosError } from "axios";
import { useUser } from "../../Components/Auth/UserContext";

const UsersPage: React.FC = () => {
  const loggedInUser = useUser();

  const [queries, setQueries] = useState<QueryProps>({
    search: "",
    searchOn: "username",
    sortBy: "username",
    order: "asc",
    page: 1,
    limit: 10,
  });

  const [userData, setUserData] = useState<{
    pending: boolean;
    error: AxiosError | null;
    users: UserProp[];
  }>({
    pending: true,
    error: null,
    users: [],
  });

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/user?search=${queries.search}&searchOn=${queries.searchOn}&sortBy=${queries.sortBy}&order=${queries.order}&page=${queries.page}&limit=${queries.limit}`
      )
      .then((res) =>
        setUserData((prev) => ({
          ...prev,
          users: res.data,
          pending: false,
        }))
      )
      .catch((err) =>
        setUserData((prev) => ({ ...prev, error: err.response.data.error }))
      );

    socket.on("receive_status", (user) => {
      console.log(user);
    });
  }, [queries]);
  console.log(userData);
  return (
    <>
      {userData.users ? (
        <Outlet
          context={{
            userData: userData.users,
            loggedInUser,
            queries,
            setQueries,
            usersPending: userData.pending,
          }}
        />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <LoadingSpinner loading={userData.pending && !loggedInUser?._id} />
        </div>
      )}
      {userData.error && <div>Error {userData.error.message}</div>}
    </>
  );
};

export default UsersPage;
