import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import useGet from "../../Hooks/useGet";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { QueryProps, TaskDataProp } from "../../Components/types";
import { useUser } from "../../Components/Auth/UserContext";

const TaskManagerPage: React.FC = () => {
  const [queries, setQueries] = useState<QueryProps>({
    searchOn: "title",
    search: "",
    sortBy: "title",
    order: "asc",
    page: 1,
    limit: 6,
  });

  const loggedInUser = useUser();

  const {
    data: taskData,
    pending: tasksPending,
    error: tasksError,
  } = useGet<TaskDataProp>(
    `http://localhost:8000/task?search=${queries.search}&searchOn=${queries.searchOn}&sortBy=${queries.sortBy}&order=${queries.order}&page=${queries.page}&limit=${queries.limit}`
  );

  const [pathname, setPathname] = useState<string | undefined>(
    location.pathname.substring(13)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueries((prev) => ({ ...prev, search: e.target.value }));
  };

  console.log("Q:", queries);
  console.log("T:", taskData);

  return (
    <>
      {loggedInUser?.isAdmin ? (
        <>
          {" "}
          <div className="flex pt-20 px-10 items-center justify-between">
            <div className="">
              <Link to="list">
                <button
                  className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                    pathname === "list" ? "bg-black text-white" : "bg-none"
                  }`}
                  onClick={() =>
                    setPathname(() => location.pathname.substring(13))
                  }
                >
                  List Tasks
                </button>
              </Link>
              <Link to="edit">
                <button
                  className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                    pathname === "edit" ? "bg-black text-white" : "bg-none"
                  }`}
                  onClick={() =>
                    setPathname(() => location.pathname.substring(13))
                  }
                >
                  Edit Tasks
                </button>
              </Link>
              <Link to="add">
                <button
                  className={`p-2 rounded-md border border-black m-2 hover:bg-black hover:text-white transition ${
                    pathname === "add" ? "bg-black text-white" : "bg-none"
                  }`}
                  onClick={() =>
                    setPathname(() => location.pathname.substring(13))
                  }
                >
                  Add Tasks
                </button>
              </Link>
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <input
                type="text"
                className="p-2 rounded-md border border-black cursor-text"
                placeholder="Search"
                value={queries.search}
                onChange={(e) => handleSearch(e)}
              />
              <div className="flex justify-between w-full">
                <select
                  className="p-2 border rounded cursor-pointer"
                  name="order"
                  value={queries.order}
                  onChange={(e) =>
                    setQueries((prev: QueryProps) => ({
                      ...prev,
                      order: e.target.value,
                    }))
                  }
                >
                  <option value={"asc"}>Ascending</option>
                  <option value={"desc"}>Descending</option>
                </select>
                <select
                  className="p-2 border rounded cursor-pointer"
                  name="limit"
                  value={queries.limit}
                  onChange={(e) =>
                    setQueries((prev: QueryProps) => ({
                      ...prev,
                      limit: parseInt(e.target.value),
                    }))
                  }
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={30}>30</option>
                </select>
              </div>
              <div className="flex justify-between w-full items-center">
                <button
                  className="p-2 border rounded bg-white cursor-pointer"
                  onClick={() =>
                    setQueries((prev) => ({
                      ...prev,
                      page: Math.max(prev.page - 1, 1),
                    }))
                  }
                  disabled={queries.page === 1}
                >
                  Prev
                </button>
                <span>{queries.page}</span>
                <button
                  className="p-2 border rounded bg-white cursor-pointer"
                  onClick={() =>
                    setQueries((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={queries.page === taskData?.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          {taskData?.tasks && <Outlet context={{ taskData }} />}
          {/* Loading spinner */}
          {tasksPending && (
            <div className="w-full flex items-center justify-center">
              <LoadingSpinner loading={tasksPending} />
            </div>
          )}
          {tasksError && <div>Network Error</div>}
        </>
      ) : (
        <div className="font-bold text-xl flex flex-col w-full h-full items-center justify-center">
          <p className="mb-10">You don't have permisson for this page!</p>
          <Link to="/">{"<"} Return</Link>
        </div>
      )}
    </>
  );
};

export default TaskManagerPage;
