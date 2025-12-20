import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

  // ⚠️ показываем модалку ТОЛЬКО после завершения refresh
  useEffect(() => {
    if (!isRefreshing && !isLoggedIn) {
      setShowModal(true);
    }
  }, [isRefreshing, isLoggedIn]);

  // ⏳ ждём refresh — НИЧЕГО не рендерим
  if (isRefreshing) {
    return null; // или loader
  }

  // ❌ не авторизован → модалка
  if (!isLoggedIn && showModal) {
    return (
      <AuthModal
        onClose={() => {
          setShowModal(false);
          navigate("/", { replace: true });
        }}
      />
    );
  }

  // ✅ авторизован
  return children;
};

export default PrivateRoute;

