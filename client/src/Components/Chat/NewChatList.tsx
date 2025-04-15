import React from "react";
import { ChatProp, FriendshipProp } from "../types";
import { v4 } from "uuid";

type Props = {
  input: string;
  friends?: FriendshipProp["otherUser"][];
  participantIds: string[];
  isVisible: { input: boolean; selected: boolean };
  chatRooms: ChatProp[];
  handleAdd: (id: string) => void;
  handleRemove: (id: string) => void;
};

const NewChatList: React.FC<Props> = ({
  input,
  friends = [],
  participantIds,
  isVisible,
  handleAdd,
  handleRemove,
  chatRooms,
}) => {
  const selectedFriends = friends.filter((f) => participantIds.includes(f._id));
  const filteredFriends = friends.filter(
    (f) =>
      !participantIds.includes(f._id) &&
      f.username.toLowerCase().includes(input.toLowerCase())
  );
  const chatRoomParticipants = chatRooms
    .map((c) => c.participants)
    .flat()
    .map((f) => f._id);

  return (
    <div className="py-2">
      <div className="flex flex-wrap space-x-2 w-full">
        {selectedFriends.map((f) => (
          <div
            key={f._id}
            className="border p-2 rounded-lg cursor-pointer border-black"
            onClick={() => handleRemove(f._id)}
          >
            {f.username}
          </div>
        ))}
      </div>

      {isVisible.selected && (
        <div className="bg-white rounded-md" id="newChatList">
          {filteredFriends &&
            filteredFriends
              .filter((f) => !chatRoomParticipants.includes(f._id))
              .map((f) => (
                <div
                  key={v4()}
                  onClick={() => handleAdd(f._id)}
                  className="flex hover:bg-gray-200 rounded-md cursor-pointer"
                >
                  <img
                    className="h-10 w-10 rounded-md"
                    src={`/src/img/pfps/${f.avatar}`}
                    alt=""
                  />
                  <p key={f._id} className="p-2 ">
                    {f.username}
                  </p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default NewChatList;
