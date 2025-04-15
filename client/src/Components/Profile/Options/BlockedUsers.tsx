import React from "react";
import { FriendshipProp } from "../../types";
import { FaTrash } from "react-icons/fa";

interface Props {
  blockedUsers: FriendshipProp[];
  loggedInUserId: string;
  handleUnblockUser: (id: string, otherUserId: string) => void;
}

const BlockedUsers: React.FC<Props> = ({
  blockedUsers,
  loggedInUserId,
  handleUnblockUser,
}) => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold border-l-4 pl-2 mb-5">Blocked Users</h2>
      <div className="space-y-2">
        {blockedUsers.length > 0 ? (
          blockedUsers
            .filter((f) => f.blockedBy === loggedInUserId)
            .map((f) => (
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-md mr-2"
                  src={`/src/img/pfps/${f.otherUser.avatar}`}
                  alt=""
                />
                <p className="w-64">{f.otherUser.username}</p>
                <FaTrash
                  onClick={() => handleUnblockUser(f._id, f.otherUser._id)}
                  className="border-l w-10 h-5"
                />
              </div>
            ))
        ) : (
          <div>No blocked users</div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;
