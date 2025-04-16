import axios from "axios";
import React, { FormEvent, useState } from "react";
import { apiUrl } from "../../types";

const RestoreAccount: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [message, setMessage] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post(apiUrl + "/user/restoreAccount", { email: email })
      .then(() => setMessage("Email sent to your address!"))
      .catch((err) => {
        setMessage(err.response.data.Error);
      });
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
          <p className="my-10">We will send a code to restore your account</p>
          <input
            className="p-2 w-fit bg-white rounded-md border"
            type="submit"
            value="Submit"
          />
          {message && <p className="mt-10">{message}</p>}
        </form>
      </div>
      <div
        className="bg-center bg-cover h-screen w-full"
        style={{
          backgroundImage: "url(/src/img/resurrection.png)",
        }}
      ></div>
    </main>
  );
};

export default RestoreAccount;
