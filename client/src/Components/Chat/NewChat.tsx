import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { ChatProp, FriendshipProp, UserProp } from "../types";
import NewChatList from "./NewChatList";

import socket from "../socket";

type Props = {
  loggedInUser: UserProp;
  chatRooms: ChatProp[];
  friends?: FriendshipProp["otherUser"][];
  newChatInput: string;
  setNewChatInput: Dispatch<SetStateAction<string>>;
};

const NewChat: React.FC<Props> = ({
  loggedInUser,
  friends = [],
  newChatInput,
  setNewChatInput,
  chatRooms,
}) => {
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [showList, setShowList] = useState({ input: false, selected: false });

  const addParticipant = (id: string) => {
    if (!participantIds.includes(id)) {
      setParticipantIds([...participantIds, id]);
      setNewChatInput("");
      setShowList({ input: false, selected: true });
    }
  };

  const removeParticipant = (id: string) => {
    setParticipantIds(participantIds.filter((pid) => pid !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allIds = [...participantIds, loggedInUser._id];

    socket.emit("new_chat", allIds);

    setParticipantIds([]);
    setNewChatInput("");
    setShowList({ input: false, selected: true });
  };

  return (
    <form className="w-full border-b" onSubmit={handleSubmit}>
      <div className="flex justify-between w-full">
        <input
          className="p-2 rounded-md h-10 w-4/5 border border-black"
          type="text"
          value={newChatInput}
          placeholder="New Chat"
          onChange={(e) => setNewChatInput(e.target.value)}
          onClick={() => setShowList({ input: true, selected: true })}
          onBlur={() => {
            setTimeout(() => {
              setShowList({ selected: false, input: true });
            }, 100);
          }}
        />
        {participantIds.length > 0 && (
          <button
            type="submit"
            className="flex border border-black items-center justify-center w-10 h-10 text-2xl rounded-md hover:bg-green-400 hover:text-white transition"
          >
            <FaCheck />
          </button>
        )}
      </div>

      <NewChatList
        isVisible={showList}
        input={newChatInput}
        friends={friends}
        participantIds={participantIds}
        chatRooms={chatRooms}
        handleAdd={addParticipant}
        handleRemove={removeParticipant}
      />
    </form>
  );
};

export default NewChat;
