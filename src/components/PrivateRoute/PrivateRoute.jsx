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

  const token = localStorage.getItem("accessToken");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 КЛЮЧ: если есть token — НЕ показываем модалку
    if (!isRefreshing && !isLoggedIn && !token) {
      setShowModal(true);
    }
  }, [isRefreshing, isLoggedIn, token]);

  // ⏳ если был бы refresh — ждали бы
  if (isRefreshing) {
    return null;
  }

  // ❌ реально не авторизован
  if (!isLoggedIn && !token && showModal) {
    return (
      <AuthModal
        onClose={() => {
          setShowModal(false);
          navigate("/", { replace: true });
        }}
      />
    );
  }

  // ✅ либо Redux, либо token
  return children;
};

export default PrivateRoute;


