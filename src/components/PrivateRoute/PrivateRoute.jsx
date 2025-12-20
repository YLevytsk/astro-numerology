import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthModal from "../ModalErrorSave/ModalErrorSave.jsx";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../redux/auth/selectors";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRefreshing && !isLoggedIn) {
      setShowModal(true);
    }
  }, [isRefreshing, isLoggedIn]);

  if (isRefreshing) return null;

  if (!isLoggedIn && showModal) {
    return (
      <AuthModal
        onClose={() => {
          setShowModal(false);
          navigate("/");
        }}
      />
    );
  }

  return children;
};

export default PrivateRoute;

