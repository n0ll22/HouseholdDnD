import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React, { useContext } from "react";
import App from "../App";
import AuthContext from "../Components/Auth/AuthContext";
import MainPage from "../Pages/MainPage/MainPage";
import Login from "../Components/Auth/Login/Login";
import TaskCounterPage from "../Pages/TaskCounterPage/TaskCounterPage";
import TaskManagerPage from "../Pages/TaskManagerPage/TaskManagerPage";
import EditTask from "../Components/TaskManager/EditTask/EditTask";
import ListTask from "../Components/TaskManager/ListTask/ListTask";
import AddTask from "../Components/TaskManager/AddTask/AddTask";
import TaskTutorialPage from "../Components/Documentation/TaskTutorialPage";
import EditTaskDetail from "../Components/TaskManager/EditTaskDetail/EditTaskDetail";
import UsersPage from "../Pages/UsersPage/UsersPage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import UserProfile from "../Components/Profile/Profile/UserProfile";
import Register from "../Components/Auth/Register/Register";
import PlayerList from "../Components/Users/PlayerList";
import FriendList from "../Components/Users/FriendList";
import PlayerProfile from "../Components/Profile/Profile/PlayerProfile";
import Chat from "../Components/Chat/Chat";

const Router: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <p>Error: AuthContext not available</p>;
  }

  const { loggedIn, loading } = auth;

  if (loading) {
    return <p>Loading...</p>;
    console.log("LOADING:", loggedIn);
  }

  console.log("STATE: ", loggedIn);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <h1>Page Not Found</h1>,
      children: loggedIn
        ? [
            { index: true, element: <MainPage /> },
            { path: "taskComplete", element: <TaskCounterPage /> },
            {
              path: "taskManager",
              element: <TaskManagerPage />,
              children: [
                { path: "list", element: <ListTask /> },
                {
                  path: "list/tutorial/:id",
                  element: <TaskTutorialPage />,
                },
                { path: "edit", element: <EditTask /> },
                {
                  path: "edit/:id",
                  element: <EditTaskDetail />,
                },
                { path: "add", element: <AddTask /> },
              ],
            },
            {
              path: "users",
              element: <UsersPage />,
              children: [
                { path: "list", element: <PlayerList /> },
                { path: ":id", element: <PlayerProfile /> },
              ],
            },
            {
              path: "profile",
              element: <ProfilePage />,
              children: [
                { path: "info", element: <UserProfile /> },
                { path: "comrades", element: <FriendList /> },
                { path: "chat", element: <Chat /> },
              ],
            },
          ]
        : [
            { index: true, path: "/", element: <Login /> },
            { path: "register", element: <Register /> },
          ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
