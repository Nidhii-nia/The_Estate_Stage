import { useSelector } from "react-redux";

import { userSelector } from "@/redux/slice/user.slice";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector(userSelector);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
