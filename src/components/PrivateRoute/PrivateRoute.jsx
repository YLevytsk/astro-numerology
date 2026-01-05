import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../redux/auth/selectors";
import { getCookie } from "../../utils/cookies.js";

// Guard for private routes: while refreshing do nothing; if not authed -> redirect
const PrivateRoute = ({ children, redirectTo = "/login" }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    getCookie("accessToken");

  if (isRefreshing) return null;

  if (!isLoggedIn && !token) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PrivateRoute;
