import React, { useEffect, useState } from "react";
import useGet from "../../Hooks/useGet";

import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  apiUrl,
  FriendshipProp,
  QueryProps,
  UserProp,
} from "../../Components/types";
import { Link, Outlet } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ProfilePage: React.FC = () => {
  const [queries, setQueries] = useState<QueryProps>({
    search: "",
    searchOn: "username",
    sortBy: "username",
    order: "asc",
    page: 1,
    limit: 10,
  });

  const {
    data: loggedInUser,
    pending: loggedInUserPending,
    error: loggedInUserError,
  } = useGet<UserProp>(apiUrl + "/user/loggedInUser");

  const [friendshipsData, setFriendshipsData] = useState<{
    data: FriendshipProp[];
    error: AxiosError | null;
    pending: boolean;
  }>({
    data: [],
    error: null,
    pending: true,
  });

  useEffect(() => {
    if (loggedInUser) {
      axios
        .post(
          apiUrl +
            `/friendship/getAllFriendshipForUser/${loggedInUser._id}?search=${queries.search}&searchOn=${queries.searchOn}&sortBy=${queries.sortBy}&order=${queries.order}&page=${queries.page}&limit=${queries.limit}`,
          {
            friendshipIds: loggedInUser.friendships,
          }
        )
        .then((res) => {
          setFriendshipsData((prev) => ({
            ...prev,
            data: res.data,
            pending: false,
          }));
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          setFriendshipsData((prev) => ({ ...prev, error: err }));
        });
    }
  }, [loggedInUser, queries]);

  const [selectedPage, setSelectedPage] = useState(window.location.pathname);

  return (
    <>
      <div className="flex pt-20 sm:pl-5 pl-10 space-x-4">
        <Link to="info">
          <button
            onClick={() => setSelectedPage("info")}
            className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
              selectedPage.includes("info") ? "bg-black text-white" : "bg-none"
            }`}
          >
            Your Info
          </button>
        </Link>
        <Link to="comrades">
          <button
            onClick={() => setSelectedPage("comrades")}
            className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
              selectedPage.includes("comrades")
                ? "bg-black text-white"
                : "bg-none"
            }`}
          >
            Comrades
          </button>
        </Link>
        <Link to="chat">
          <button
            onClick={() => setSelectedPage("chat")}
            className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
              selectedPage.includes("chat") ? "bg-black text-white" : "bg-none"
            }`}
          >
            Chat
          </button>
        </Link>
        <Link to="options">
          <button
            onClick={() => setSelectedPage("options")}
            className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
              selectedPage.includes("options")
                ? "bg-black text-white"
                : "bg-none"
            }`}
          >
            Options
          </button>
        </Link>
      </div>
      {loggedInUser ? (
        <Outlet
          context={{
            loggedInUser,
            friendships: friendshipsData.data,
            queries,
            setQueries,
            setFriendshipsData,
          }}
        />
      ) : null}
      {loggedInUserPending ||
        (friendshipsData.pending && (
          <div className="w-full flex items-center justify-center">
            <LoadingSpinner loading={loggedInUserPending} />
          </div>
        ))}
      {loggedInUserError || friendshipsData.error ? (
        <div>Network Error</div>
      ) : null}
    </>
  );
};

export default ProfilePage;
