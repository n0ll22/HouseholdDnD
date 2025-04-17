import React, { FormEvent, useState } from "react";
import { Api } from "../../../QueryFunctions";

const RestorePassword: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      await Api().postRestorePassword(email, setMessage);
    }
  };

  console.log(email);

  return (
    <main className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <h1 className="text-6xl mb-20 font-bold">Restoration</h1>
        <form
          className="flex flex-col items-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">
              Email:
            </label>

            <input
              className="border rounded-md p-1"
              placeholder="#&@123!?"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="my-10">
            We will send a code to set a new password for you
          </p>
          <input
            className="p-2 w-fit bg-white rounded-md border hover:bg-gray-200 active:bg-gray-400"
            type="submit"
            value="Submit"
            onClick={() => setMessage("Waiting for server to respond...")}
          />
        </form>
      </div>
      <div
        className="bg-center bg-cover h-screen w-full"
        style={{
          backgroundImage: "url(/src/img/resurrection.png)",
        }}
      ></div>
      {message && <p className="mt-10">{message}</p>}
    </main>
  );
};

export default RestorePassword;
