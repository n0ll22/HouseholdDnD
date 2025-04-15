import React, { useEffect } from "react";
import { QueryProps, UserDataProp, UserProp } from "../types.ts";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SetQuery } from "../../QueryFunctions.tsx";

const UserList: React.FC = () => {
  const { userData, queries, setQueries, usersPending, loggedInUser } =
    useOutletContext<{
      userData: UserDataProp;
      loggedInUser: UserProp;
      queries: QueryProps;
      setQueries: React.Dispatch<React.SetStateAction<QueryProps>>;
      usersPending: boolean;
    }>();

  const navigate = useNavigate();

  console.log(userData);

  return (
    <main className="flex flex-col w-full items-start p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-20">
        Hall of Fame
      </h1>

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

      {/* Loading Indicator */}
      {usersPending ? (
        <div className="w-full flex  justify-center items-center my-10">
          <span className="text-lg font-medium">Loading...</span>
        </div>
      ) : (
        <div className="w-full p-2 bg-white rounded-lg">
          <table className="table-auto w-full border-gray-300 shadow-lg rounded-lg">
            <thead className="border-b text-left">
              <tr className="">
                <th className="w-16 px-4 py-2"></th>
                <th className="px-4 py-2">Username</th>

                <th className="w-16 px-4 py-2">Level</th>
              </tr>
            </thead>
            <tbody className="rounded-b-lg">
              {userData.users.map((u: UserProp, ui: number) => (
                <tr
                  key={ui}
                  onClick={() => {
                    navigate(
                      `${
                        u._id === loggedInUser._id
                          ? "/profile/info"
                          : `/users/${u._id}`
                      }`
                    );
                  }}
                  className="hover:bg-gray-200/50 rounded-md"
                >
                  <td className="px-4 py-2">
                    <div
                      className="bg-center bg-cover w-16 h-16 rounded-full"
                      style={{
                        backgroundImage: `url(/src/img/pfps/${u.avatar})`,
                      }}
                    ></div>
                  </td>
                  <td className="px-4 py-2 font-medium flex items-center h-20">
                    <p>{u.username}</p>
                    <div
                      className={`w-2 h-2 rounded-full ml-2 ${
                        u.status === "online" ? "bg-green-500 " : "bg-red-500"
                      }`}
                    ></div>
                  </td>

                  <td className="px-4 py-2 text-center">{u.lvl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex w-full justify-center items-center my-4 space-x-4">
        <button
          className="p-2 border rounded bg-white cursor-pointer"
          onClick={
            SetQuery(setQueries).handlePaginationChange().handlePerviousPage
          }
          disabled={queries.page === 1}
        >
          Previous
        </button>
        <span>{queries.page}</span>
        <button
          className="p-2 border rounded bg-white cursor-pointer"
          onClick={SetQuery(setQueries).handlePaginationChange().handleNextPage}
          disabled={queries.page === userData.totalPages}
        >
          Next
        </button>
      </div>
      <p>Total Users: {userData.totalUsers}</p>
    </main>
  );
};

export default UserList;
