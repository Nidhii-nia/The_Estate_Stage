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
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const { data } = await axios.get("/api/auth/session");

        if (active && data?.data) {
          dispatch(signInSuccess(data.data));
        }
      } catch (error) {
        console.log("Error PrivateRoute: ",error);
        
        if (active) {
          dispatch(logoutUserSuccess());
          navigate("/sign-in", { replace: true });
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [dispatch, navigate]);

  if (checkingSession) return null;

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
