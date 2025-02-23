import React, { useState } from "react";
import useGet from "../../Hooks/useGet";

import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { User } from "../../Components/types";
import { Link, Outlet } from "react-router-dom";

const ProfilePage: React.FC = () => {
    const {
        data: loggedInUser,
        pending: loggedInUserPending,
        error: loggedInUserError,
    } = useGet<User>("http://localhost:8000/user/loggedInUser");

    const {
        data: usersData,
        pending: usersPending,
        error: usersError,
    } = useGet<User[]>("http://localhost:8000/user/");

    const {
        data: friendsData,
        pending: friendsPending,
        error: friendsError,
    } = useGet<User[]>("http://localhost:8000/user/comrades");

    const [selectedPage, setSelectedPage] = useState(window.location.pathname);

    return (
        <>
            <div className="flex pt-20 sm:pl-5 pl-10 space-x-4">
                <Link to="info">
                    <button
                        onClick={() => setSelectedPage("info")}
                        className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
                            selectedPage.includes("info")
                                ? "bg-black text-white"
                                : "bg-none"
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
                            selectedPage.includes("chat")
                                ? "bg-black text-white"
                                : "bg-none"
                        }`}
                    >
                        Chat
                    </button>
                </Link>
                <Link to="info">
                    <button
                        onClick={() => setSelectedPage("options")}
                        className={`p-2 rounded-md border border-black hover:bg-black hover:text-white transition ${
                            selectedPage.includes("profile/options")
                                ? "bg-black text-white"
                                : "bg-none"
                        }`}
                    >
                        Options
                    </button>
                </Link>
            </div>
            {loggedInUser ? (
                <Outlet context={{ loggedInUser, usersData, friendsData }} />
            ) : null}
            {loggedInUserPending && (
                <div className="w-full flex items-center justify-center">
                    <LoadingSpinner loading={loggedInUserPending} />
                </div>
            )}
            {loggedInUserError ? <div>Network Error</div> : null}
        </>
    );
};

export default ProfilePage;
