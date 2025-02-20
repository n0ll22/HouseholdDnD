import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterData {
    username: string;
    password: string;
    passwordAgain: string;
}

const Register: React.FC = () => {
    const [error, setError] = useState<string>();
    const [data, setData] = useState<RegisterData>({
        username: "",
        password: "",
        passwordAgain: "",
    });

    const navigate = useNavigate();

    //regisztárció kezelése
    const handleRegistration = async (e: FormEvent) => {
        //ha minden field ki van töltve, akkor küldés az adatbázishoz
        e.preventDefault();

        await axios
            .post("http://localhost:8000/user/register", data)
            .then(() => {
                console.log("User Created!");
                navigate("/"); //navigáljunk a főoldalra majd frissítsük az oldalt
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
                setError(err?.response?.data?.Error);
            });
        //navigáljunk a főoldalra majd frissítsük az oldalt
    };

    console.log(data);

    return (
        <main className="flex w-full items-start xl:justify-center xl:items-center">
            <form
                className="flex flex-col w-1/2 h-screen xl:w-2/3 justify-center items-center"
                onSubmit={handleRegistration}
            >
                <h1 className="p-2 mb-5 text-4xl font-bold">
                    Start your adventure!
                </h1>
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
                    <div className="flex flex-col mb-4">
                        <label htmlFor="password" className="mb-1">
                            Password Again:
                        </label>
                        <input
                            className="border rounded-md"
                            type="password"
                            name="password"
                            value={data.passwordAgain}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev!,
                                    passwordAgain: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <input
                        type="submit"
                        name="submit"
                        id=""
                        className=" border rounded-lg w-full bg-white cursor-pointer hover:bg-gray-200 transition"
                    />
                    {error && <p className="text-red-700">{error}</p>}
                </div>
                <p className="mt-10">Already a member?</p>
                <p className="border rounded-lg w-32 text-center bg-white cursor-pointer hover:bg-gray-200 transition">
                    <Link to="/login">Login</Link>
                </p>
            </form>

            <div
                className="w-1/2 xl:hidden h-screen bg-cover bg-center "
                style={{
                    backgroundImage: `url("./src/img/login-wallpaper-4.jpg")`,
                }}
            ></div>
        </main>
    );
};

export default Register;
