import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./Components/Auth/AuthContext.tsx";

import Router from "./Router/Router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  </React.StrictMode>
);
