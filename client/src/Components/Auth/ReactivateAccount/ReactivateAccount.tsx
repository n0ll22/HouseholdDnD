import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Api } from "../../../QueryFunctions";

const ReactivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Redirecting...");

  useEffect(() => {
    if (token) {
      Api().postReactivateAccount(token, navigate, setMessage);
    }
  }, []);

  return <div>{message}</div>;
};

export default ReactivateAccount;
