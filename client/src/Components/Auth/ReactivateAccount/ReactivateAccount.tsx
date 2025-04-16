import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../types";

const ReactivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Redirecting...");

  useEffect(() => {
    axios
      .post(apiUrl + "/user/reactivate-account", { token })
      .then(() => setTimeout(() => (navigate("/"), 2000)))
      .catch((err) => setMessage(err.response.data.Error));
  }, []);

  return <div>{message}</div>;
};

export default ReactivateAccount;
