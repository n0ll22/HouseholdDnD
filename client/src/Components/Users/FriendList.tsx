import React, { useEffect, useState } from "react";
import List from "../List/List.tsx";
import { User, ExtendedUser, apiUrl } from "../types.ts";
import { useNavigate, useOutletContext } from "react-router-dom";

import useGet from "../../Hooks/useGet.tsx";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.tsx";
import axios from "axios";

import PendingRequest from "../PendingRequest/PendingRequest.tsx";

const UserList: React.FC = () => {
  const { userData } = useOutletContext<{ userData: User }>();
  const {
    data: playerData,
    error: playerDataError,
    pending: playerDataPending,
  } = useGet<User[]>(apiUrl + "/user/comrades");

  const [pendingRequest, setPendingRequest] = useState<User[]>();
  const [pendingRequestTab, setPendingRequestTab] = useState<boolean>();
  const navigate = useNavigate();

  //const navigate = useNavigate();

  const organize: ExtendedUser[] = [];

  if (playerData) {
    console.log(playerData);
    playerData.map((i: User) => {
      organize.push({
        avatarDiv: (
          <div
            className="bg-center bg-cover w-14 h-14 rounded-full"
            style={{
              backgroundImage: `url("/src/img/pfps/${i.avatar}")`,
            }}
          ></div>
        ),
        username: i.username,
        lvl: i.lvl,
        _id: i._id,
      });
    });
  }

  useEffect(() => {
    if (playerData) {
      axios
        .post(apiUrl + "/user/multipleUsers", userData.pendingComrade)
        .then((res) => setPendingRequest(res.data))
        .catch((err) => console.error(err));
    }
  }, [userData, playerData]);

  const handleRequest = (id: string, answer: boolean, index: number) => {
    if (answer) {
      axios
        .put(apiUrl + "/user/acceptFriendRequest/" + id, {
          userId: userData._id,
        })
        .then((res) => {
          console.log(res);
          document
            .querySelectorAll(`.request${index}`)
            .forEach((element) => element.remove());
        })
        .catch((err) => console.error(err));
    }

    if (!answer) {
      axios
        .put(apiUrl + "/user/declineFriendRequest/" + id, {
          userId: userData._id,
        })
        .then((res) => {
          console.log(res);
          document
            .querySelectorAll(`.request${index}`)
            .forEach((element) => element.remove());
        })
        .catch((err) => console.error(err));
    }
  };

  const handleNavigationToPlayer = (id: string) => {
    navigate("/users/" + id);
  };

  return (
    <>
      {playerData && (
        <div className="px-10 sm:px-5">
          <button
            className={`flex my-2 w-fit p-2 border border-black rounded-lg hover:bg-black hover:text-white transition
            ${
              pendingRequestTab && pendingRequest!.length > 0
                ? "bg-black text-white"
                : "bg-none text-black"
            }`}
            onClick={() => setPendingRequestTab((prev) => !prev)}
          >
            {pendingRequest && pendingRequest!.length > 0 ? (
              <>
                <p>Pending Requests:</p>
                <p className="ml-1">{pendingRequest!.length}</p>
              </>
            ) : (
              <div>No Pending Requests</div>
            )}
          </button>
          {!pendingRequest && <LoadingSpinner loading={!pendingRequest} />}
          <div
            className={`my-10 transition-all duration-200 ease-out transform overflow-hidden ${
              pendingRequestTab
                ? "translate-y-0 opacity-100 max-h-96"
                : "-translate-y-10 opacity-0 max-h-0"
            }`}
          >
            {pendingRequest && (
              <PendingRequest
                users={pendingRequest}
                handleRequest={handleRequest}
                userId={userData._id}
              />
            )}
          </div>

          <List
            data={organize}
            headerTitle={["", "Name", "Level"]}
            size={3}
            loading={playerDataPending}
            error={null}
            handleOnClick={handleNavigationToPlayer}
          />
        </div>
      )}
      {playerDataPending && <div>{playerDataError?.message}</div>}
    </>
  );
};

export default UserList;
