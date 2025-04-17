import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  apiUrl,
  ChatProp,
  ChatRoomProp,
  QueryProps,
  RegistrationData,
  UserProp,
} from "./Components/types";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";

export function SetQuery(
  setQueries: React.Dispatch<SetStateAction<QueryProps>>
) {
  const handleQuerySearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleQuerySortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  const handleQueryOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      order: e.target.value,
    }));
  };

  const handleQueryLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueries((prev: QueryProps) => ({
      ...prev,
      limit: parseInt(e.target.value),
    }));
  };

  const handlePaginationChange = () => {
    const handleNextPage = () => {
      setQueries((prev: QueryProps) => ({ ...prev, page: prev.page + 1 }));
    };
    const handlePerviousPage = () => {
      setQueries((prev: QueryProps) => ({
        ...prev,
        page: Math.max(prev.page - 1, 1),
      }));
    };

    return { handleNextPage, handlePerviousPage };
  };

  return {
    handlePaginationChange,
    handleQueryLimitChange,
    handleQueryOrderChange,
    handleQuerySearchChange,
    handleQuerySortByChange,
  };
}

export function Api() {
  const postRegistration = async (
    registrationData: RegistrationData,
    navigate: NavigateFunction,
    setMessage: Dispatch<SetStateAction<string | null>>
  ) => {
    await axios
      .post(apiUrl + "/user/register", registrationData)
      .then(() => {
        //Ha sikeres a regisztáció automatikusan bejelenkeztet minket az oldal
        navigate("/"); //Navigáljunk a főoldalra majd frissítsük az oldalt
        window.location.reload(); //Oldal frissítése
      })
      .catch((err) => {
        //Hiba esetén jelenítsük meg a hibát
        console.error(err);
        setMessage(err?.response?.data?.Error);
      });
  };

  const postLogin = async (
    loginData: {
      username: string;
      password: string;
    },
    getLoggedIn: () => Promise<void>,
    checkLoginStatus: () => Promise<void>,
    navigate: NavigateFunction,
    setMessage: Dispatch<SetStateAction<string | null>>
  ) => {
    await axios
      .post(apiUrl + "/user/login", loginData)
      .then(() => {
        getLoggedIn(); //Ellenőrzés, hogy sikerült-e bejelentkezni
        checkLoginStatus();
        navigate("/"); //Navigálás a főoldalra
        window.location.reload(); //Oldal újratöltése
      })
      .catch((err) => {
        //Hiba esetén hiba megjeleníése
        console.error(err);
        setMessage(err.response.data.error); //Hiba tárolása
      });
  };

  const postReactivateAccount = async (
    token: string,
    navigate: NavigateFunction,
    setMessage: Dispatch<SetStateAction<string>>
  ) => {
    await axios
      .post(apiUrl + "/user/reactivate-account", { token })
      .then(() => setTimeout(() => (navigate("/"), 2000)))
      .catch((err) => setMessage(err.response.data.Error));
  };

  const postRestoreAccount = async (
    email: string,
    setMessage: Dispatch<SetStateAction<string | null>>
  ) => {
    try {
      await axios.post(apiUrl + "/user/restoreAccount", { email });
      setMessage("Email sent to your address!");
    } catch (err: any) {
      setMessage(err.response?.data?.Error || "Something went wrong.");
    }
  };

  const postResetPassword = async (
    token: string,
    password: string,
    passwordAgain: string,
    setMessage: Dispatch<SetStateAction<string | null>>,
    navigate: NavigateFunction
  ) => {
    await axios
      .post(apiUrl + "/user/reset-password", {
        token,
        password,
        passwordAgain,
      })
      .then(() => {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000); // Corrected to use navigate with the URL directly} );
      })
      .catch((err) => setMessage(err.response.data.Error));
  };

  const postRestorePassword = async (
    email: string,
    setMessage: Dispatch<SetStateAction<string | null>>
  ) => {
    axios
      .post(apiUrl + "/user/restorePassword", { email: email })
      .then(() => setMessage("Email sent to your adress!"))
      .catch((err) =>
        setMessage(err.response.data.Error || "Something went wrong!")
      );
  };

  const getLoggedIn = async (
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    await axios
      .get(apiUrl + "/user/loggedIn")
      .then((res) => setLoggedIn(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const putAvatar = async (updateData: { avatar: string; _id: string }) => {
    await axios
      .put("http://localhost:8000/user/updateAvatar", updateData)
      .then(() => window.location.reload())
      .catch((err) => console.error(err));
  };

  const getByParticipants = async (
    user: UserProp,
    setChatRooms: Dispatch<SetStateAction<ChatProp[]>>
  ) => {
    await axios
      .get(`${apiUrl}/chat/getByParticipants/${user._id}`)
      .then((res) => setChatRooms(res.data))
      .catch(console.error);
  };

  const getChatById = async (
    _id: string,
    setChatRoom: Dispatch<SetStateAction<ChatRoomProp | null>>
  ) => {
    axios
      .get(apiUrl + "/chat/" + _id)
      .then((res) => setChatRoom(res.data))
      .catch((err) => console.error(err));
  };

  return {
    postLogin,
    postReactivateAccount,
    postRegistration,
    postResetPassword,
    postRestoreAccount,
    postRestorePassword,
    getLoggedIn,
    putAvatar,
    getByParticipants,
    getChatById,
  };
}
