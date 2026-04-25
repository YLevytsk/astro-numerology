import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../redux/auth/selectors";

const AdminRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const isAdmin = useSelector(selectIsAdmin);

  if (isRefreshing) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
