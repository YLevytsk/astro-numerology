import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AuthModal from "../ModalErrorSave/ModalErrorSave.jsx";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../redux/auth/selectors";

// Guard for private routes: while refreshing do nothing; if not authed -> show modal with redirect to home
const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRefreshing && !isLoggedIn && !token) {
      navigate("/", { replace: true });
    }
  }, [isRefreshing, isLoggedIn, token, navigate]);

  if (isRefreshing) {
    return null;
  }

  if (!isLoggedIn && !token) {
    return (
      <AuthModal
        onClose={() => {
          navigate("/", { replace: true });
        }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
