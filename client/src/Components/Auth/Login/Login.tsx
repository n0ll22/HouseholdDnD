//Importálások
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginData } from "../../types";
import { useAuth } from "../useAuth";

/* Ez a React Arrow Function Component a bejelentkezés felhasználói oldaláért felel 
   Rövid magyarázat:
   A ha minden adat megfelelő, akkor a kliens küldeni fog egy POST kérést a szerver felé, ami pedig
   az adatok helyességének megfelelően (felhasználónév, jelszó) fogja eldönteni, hogy bejelenkezhet-e
   a felhasználó. Ha igen, akkor sütik használatával fog a felhasználó bejelentkezni. 
*/

const Login: React.FC = () => {
  //UseState hook változók létrehozása
  //Bejelentkezési adatok tárolása
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  //Bejelentkezési hibák tárolása
  const [loginError, setLoginError] = useState<string>();
  //Bejelentkezés állapota
  const [loggedIn, setLoggedIn] = useState(false);
  //Bejelentkezés állapotának lekérdezése egyedi hook-kal
  const { getLoggedIn } = useAuth();
  //Oldalon való navigálásért felelős hook
  const navigate = useNavigate();

  //Bejelentkezés állapotát lekérdező metódus
  const checkLoginStatus = async () => {
    //Aszinkronos lekérdezés
    await getLoggedIn(); //Megvárja a választ a bejelentkezésre
    setLoggedIn(true); //Ha van válasz, akkor legyen Igaz, hogy bejelentkezett a felhasználó
  };

  //Bejelentkezésés felelős metódus
  const handleLogin = async (e: FormEvent) => {
    //Alapértelmezett események megelőzése
    e.preventDefault();

    //Adatok meglételének ellenőrzése
    if (loginData.username && loginData.password) {
      //HTTP POST kérés az adatbázis felé
      await axios
        .post("http://localhost:8000/user/login", loginData)
        .then(() => {
          getLoggedIn(); //Ellenőrzés, hogy sikerült-e bejelentkezni
          checkLoginStatus();
          navigate("/"); //Navigálás a főoldalra
          window.location.reload(); //Oldal újratöltése
        })
        .catch((err) => {
          //Hiba esetén hiba megjeleníése
          console.error(err);
          setLoginError(err.response.data.error); //Hiba tárolása
        });
    }
  };

  //JSX
  return (
    <main className="flex w-full items-start xl:justify-center xl:items-center">
      <form
        className="flex flex-col w-1/2 h-screen xl:w-2/3 justify-center items-center"
        onSubmit={handleLogin}
      >
        <h1 className="p-2 mb-5 text-4xl font-bold">
          Continue your adventure!
        </h1>
        {/* Csak akkor jelenjen meg, ha nincs a felhasználó jelentkezve */}
        {!loggedIn && (
          <div className="w-1/2 sm:w-full border-l-2 p-2">
            <div className="flex flex-col mb-4">
              {/* Felhasználóvnév megadása */}
              <label htmlFor="name" className="mb-1">
                Username:
              </label>

              <input
                className="border rounded-md p-1"
                placeholder="John Doe"
                type="text"
                name="name"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev!,
                    username: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              {/* Jelszó megadása */}
              <label htmlFor="password" className="mb-1">
                Password:
              </label>

              <input
                className="border rounded-md p-1"
                placeholder="#&@123!?"
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev!,
                    password: e.target.value,
                  }))
                }
              />
            </div>

            {/* Hiba megjelenítése, ha van */}
            {loginError && (
              <p className="text-red-700 mb-4 flex flex-col">
                <span>{loginError} </span>
                {loginError.includes("deleted") ? (
                  <button
                    onClick={() => navigate("/restoreAccount")}
                    className="text-left underline text-black"
                  >
                    Click here to restore it!
                  </button>
                ) : loginError.includes("password") ? (
                  <button
                    onClick={() => navigate("/restorePassword")}
                    className="text-left underline text-black"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </p>
            )}

            {/* Bejelenzkezés megkezdése */}
            <input
              type="submit"
              name="submit"
              id=""
              className=" border rounded-lg w-full bg-white cursor-pointer hover:bg-gray-200 transition"
            />
          </div>
        )}
        <p className="mt-10">New around here?</p>
        <p className="border text-center rounded-lg  bg-white cursor-pointer hover:bg-gray-200 transition">
          <Link className="p-4" to="/register">
            Register
          </Link>
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

export default Login; //Login Komponens exportálása
