import React, { createContext, useEffect, useState } from "react";
import { Api } from "../../QueryFunctions";

// AuthContext types
interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  getLoggedIn: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state

  // Check if the user is logged in
  const getLoggedIn = async () => {
    await Api().getLoggedIn(setLoggedIn, setLoading);
  };

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, loading, getLoggedIn }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
