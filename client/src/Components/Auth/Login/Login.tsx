import axios from "axios";
import React, { FormEvent, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { LoginData } from "../../types";
import { useAuth } from "../useAuth";

const Login: React.FC = () => {
    const [data, setData] = useState<LoginData>({ username: "", password: "" });
    const [loginError, setLoginError] = useState<string>();
    const { getLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        await getLoggedIn();
        setLoggedIn(true); // Example logic, ensure this reflects your actual state management
    };

    //bejelentkezés kezelése
    const handleLogin = async (e: FormEvent) => {
        //ha minden adat megvan, akkor küldés az adatbázis felé
        e.preventDefault();
        if (data.username && data.password) {
            await axios
                .post("http://localhost:8000/user/login", data)
                .then(() => {
                    console.log("Logging in...");
                    getLoggedIn();
                    checkLoginStatus();
                    navigate("/");
                    window.location.reload();
                })
                .catch((err) => {
                    console.error(err);
                    setLoginError(err.response.data.Error);
                });
        }
    };

    return (
        <main className="flex w-full items-start xl:justify-center xl:items-center">
            <form
                className="flex flex-col w-1/2 h-screen xl:w-2/3 justify-center items-center"
                onSubmit={handleLogin}
            >
                <h1 className="p-2 mb-5 text-4xl font-bold">
                    Continue your adventure!
                </h1>

                {!loggedIn && (
                    <div className="w-1/2 sm:w-full border-l-2 p-2">
                        <div className="flex flex-col mb-4">
                            <label htmlFor="name" className="mb-1">
                                Name:
                            </label>
                            <input
                                className="border rounded-md"
                                type="text"
                                name="name"
                                value={data.username}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev!,
                                        username: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="password" className="mb-1">
                                Password:
                            </label>
                            <input
                                className="border rounded-md"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev!,
                                        password: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        {loginError && <p>{loginError}</p>}
                        <input
                            type="submit"
                            name="submit"
                            id=""
                            className=" border rounded-lg w-full bg-white cursor-pointer hover:bg-gray-200 transition"
                        />
                    </div>
                )}
                <p className="mt-10">New around here?</p>
                <p className="border text-center rounded-lg w-32 bg-white cursor-pointer hover:bg-gray-200 transition">
                    <Link to="/register">Register</Link>
                </p>
            </form>

            <div
                className="w-1/2 h-screen xl:hidden bg-cover bg-center"
                style={{
                    backgroundImage: `url("./src/img/login-wallpaper-6.1.jpg")`,
                }}
            ></div>
        </main>
    );
};

export default Login;
