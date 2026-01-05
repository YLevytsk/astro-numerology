import s from "./ModalErrorSave.module.css";
//import IoClose from "../../assets/images/icons/close.svg?react";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const AuthModal = ({ onClose }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <button className={s.closeBtn} onClick={handleClose} aria-label="Close">
          <IoClose />
        </button>
        <h2 className={s.title}>Error while saving</h2>
        <p className={s.text}>
          To save this article, you need to <br /> authorize first
        </p>
        <div className={s.buttons}>
          <NavLink to="/login" className={s.loginBtn} onClick={handleClose}>
            Login
          </NavLink>
          <NavLink to="/register" className={s.registerBtn} onClick={handleClose}>
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
