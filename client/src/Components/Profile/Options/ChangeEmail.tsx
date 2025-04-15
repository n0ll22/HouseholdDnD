import React, { Dispatch, FormEvent, SetStateAction } from "react";

type Props = {
  email: { input: string; render: string };
  setEmail: Dispatch<SetStateAction<{ input: string; render: string }>>;
  handleNewEmail: (e: FormEvent) => void;
};

const ChangeEmail: React.FC<Props> = ({ email, setEmail, handleNewEmail }) => {
  return (
    <div className="w-80 py-10">
      <h2 className="text-2xl font-bold border-l-4 pl-2 mb-5">
        Change Email Address
      </h2>
      <form
        className="flex flex-col space-y-2"
        onSubmit={(e) => handleNewEmail(e)}
      >
        <p>Current Email Address: </p>
        <p className="font-semibold pb-4">{email.render}</p>
        <label htmlFor="newEmail">Enter New Email:</label>
        <input
          className="bg-white border p-2 rounded-md"
          type="email"
          placeholder={email.render}
          value={email.input}
          required
          onChange={(e) =>
            setEmail((prev) => ({ ...prev, input: e.target.value }))
          }
        />
        <input
          className="bg-white border p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 transition"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
};

export default ChangeEmail;
