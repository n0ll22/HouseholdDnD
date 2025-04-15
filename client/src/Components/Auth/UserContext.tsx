import { createContext, useContext } from "react";
import { UserProp } from "../types";

export const UserContext = createContext<UserProp | null>(null);
export const useUser = () => useContext(UserContext);
