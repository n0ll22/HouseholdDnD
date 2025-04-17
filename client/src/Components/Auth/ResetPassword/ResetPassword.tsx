import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importing useNavigate and useParams
import { Api } from "../../../QueryFunctions";

interface InputProp {
  password: string;
  passwordAgain: string;
}

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  console.log(token);
  const [password, setPassword] = useState<InputProp>({
    password: "",
    passwordAgain: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token && password.password && password.passwordAgain) {
      // Send the new password and token to the backend
      await Api().postResetPassword(
        token,
        password.password,
        password.passwordAgain,
        setMessage,
        navigate
      );
    }
  };

  return (
    <form
      className="w-full h-screen flex items-center justify-center "
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <h1 className="text-4xl font-bold mb-20">Set new password</h1>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1">
            Password:
          </label>

          <input
            className="border rounded-md p-1"
            placeholder="#&@123!?"
            type="password"
            name="password"
            id="password"
            min={8}
            value={password.password}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="passwordAgain" className="mb-1">
            Password Again:
          </label>

          <input
            className="border rounded-md p-1"
            placeholder="#&@123!?"
            type="password"
            name="passwordAgain"
            min={8}
            id="passwordAgain"
            value={password.passwordAgain}
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                passwordAgain: e.target.value,
              }))
            }
          />
        </div>
        <p>{message}</p>
        <input
          type="submit"
          value="Submit"
          className="p-2 border bg-white w-full rounded-md cursor-pointer hover:bg-gray-200"
        />
      </div>
    </form>
  );
};

export default ResetPassword;
