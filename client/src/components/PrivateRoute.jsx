import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  logoutUserSuccess,
  signInSuccess,
  userSelector,
} from "@/redux/slice/user.slice";
import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasCurrentUser = Boolean(currentUser);
  const [checkingSession, setCheckingSession] = useState(hasCurrentUser);

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch(logoutUserSuccess());
          navigate("/sign-in", { replace: true });
        }

        return Promise.reject(error);
      },
    );

    if (hasCurrentUser) {
      axios
        .get("/api/auth/session")
        .then(({ data }) => dispatch(signInSuccess(data.data)))
        .catch(() => {})
        .finally(() => setCheckingSession(false));
    }

    return () => axios.interceptors.response.eject(interceptorId);
  }, [dispatch, hasCurrentUser, navigate]);

  if (checkingSession) return null;

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
