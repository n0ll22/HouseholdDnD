import React, { useEffect } from "react";
import { FriendshipProp, QueryProps, UserProp } from "../types.ts";
import { useNavigate, useOutletContext } from "react-router-dom";
import FriendRequest from "./FriendRequest.tsx";
import { SetQuery } from "../../QueryFunctions.tsx";
import socket from "../socket.ts";
import { AxiosError } from "axios";
import { FaTrash } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { useNotification } from "../Notification/Notification.tsx";

const FriendList: React.FC = () => {
  const { friendships, setFriendshipsData, queries, setQueries, loggedInUser } =
    useOutletContext<{
      queries: QueryProps;
      setQueries: React.Dispatch<React.SetStateAction<QueryProps>>;
      friendships: FriendshipProp[];
      setFriendshipsData: React.Dispatch<
        React.SetStateAction<{
          data: FriendshipProp[];
          error: AxiosError | null;
          pending: boolean;
        }>
      >;
      loggedInUser: UserProp;
    }>();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleDeleteFriend = (
    friendshipId: string,
    otherUser: FriendshipProp["otherUser"]
  ) => {
    socket.emit("answer_friendRequest", {
      id: friendshipId,
      status: "refused",
      senderId: otherUser,
      receiverId: loggedInUser,
    });
    notify("Friend deleted", null);
  };

  const handleBlockFriend = (
    friendshipId: string,
    otherUser: FriendshipProp["otherUser"]
  ) => {
    socket.emit("answer_friendRequest", {
      id: friendshipId,
      status: "blocked",
      senderId: otherUser,
      receiverId: loggedInUser,
    });
    notify("Friend Blocked", null);
  };

  useEffect(() => {
    socket.on("receive_friendRequest_answer", (res) => {
      console.log(res);
    });

    return () => {
      socket.off("receive_friendRequestAnswer");
    };
  }, []);

  console.log("FL:::", friendships);

  return (
    <main className="flex flex-col w-full items-start p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-10">
        Hall of Fame
      </h1>
      <FriendRequest
        loggedInUserId={loggedInUser._id}
        setFriendshipsData={setFriendshipsData}
        friendships={friendships}
      />
      {/* Search Input */}
      {/* Sorting and Pagination Controls */}
      <div className="flex items-center justify-end w-full mb-4 space-x-4">
        <div className="w-full flex justify-center">
          <input
            className="p-2 w-full rounded-md border"
            type="text"
            placeholder="Search by username"
            value={queries.search}
            onChange={(e) => SetQuery(setQueries).handleQuerySearchChange(e)}
          />
        </div>
        <select
          className="p-2 border rounded"
          value={queries.sortBy}
          onChange={(e) => SetQuery(setQueries).handleQuerySortByChange(e)}
        >
          <option value="username">Username</option>
          <option value="lvl">Level</option>
        </select>

        <select
          className="p-2 border rounded"
          value={queries.order}
          onChange={(e) => SetQuery(setQueries).handleQueryOrderChange(e)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <select
          className="p-2 border rounded"
          value={queries.limit}
          onChange={(e) => SetQuery(setQueries).handleQueryLimitChange(e)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="w-full p-2 bg-white rounded-lg">
        <table className="table-auto w-full border-gray-300 shadow-lg rounded-lg">
          <thead className="border-b text-left">
            <tr className="">
              <th className="w-16 px-4 py-2"></th>
              <th className="px-4 py-2">Username</th>
              <th className="w-16 px-4 py-2">Level</th>
              <th className="w-16 px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody className="rounded-b-lg">
            {friendships &&
              friendships
                .filter((f) => f.status === "accepted")
                .map((c: FriendshipProp, ci: number) => (
                  <tr key={ci} className="hover:bg-gray-200/50 rounded-md">
                    <td className="px-4 py-2">
                      <div
                        className="bg-center bg-cover w-16 h-16 rounded-md"
                        style={{
                          backgroundImage: `url(/src/img/pfps/${c.otherUser.avatar})`,
                        }}
                      >
                        <div className="flex h-full w-full flex-row-reverse items-end">
                          <div
                            className={`w-4 h-4 translate-x-1 translate-y-1 rounded-full ${
                              c.otherUser.status === "online"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-4 py-2 font-medium"
                      onClick={() => {
                        navigate("/users/" + c.otherUser._id);
                      }}
                    >
                      {c.otherUser.username}
                    </td>
                    <td className="px-4 py-2 text-center">{c.otherUser.lvl}</td>
                    <td className="h-20 w-full flex items-center justify-around">
                      <button></button>
                      <FaTrash
                        onClick={() => handleDeleteFriend(c._id, c.otherUser)}
                      />
                      <ImBlocked
                        onClick={() => handleBlockFriend(c._id, c.otherUser)}
                      />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex w-full justify-center items-center my-4 space-x-4">
        <button
          className="p-2 border rounded bg-white cursor-pointer"
          onClick={() =>
            SetQuery(setQueries).handlePaginationChange().handlePerviousPage()
          }
          disabled={queries.page === 1}
        >
          Prev
        </button>
        <span>{queries.page}</span>
        <button
          className="p-2 border rounded bg-white cursor-pointer"
          onClick={() =>
            SetQuery(setQueries).handlePaginationChange().handlePerviousPage
          }
          disabled={
            queries.page === Math.ceil(friendships.length / queries.limit)
          }
        >
          Next
        </button>
      </div>
      <p>Total Users: {friendships?.length}</p>
    </main>
  );
};

export default FriendList;
