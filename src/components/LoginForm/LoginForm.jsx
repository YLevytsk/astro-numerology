import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useEffect, useId, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

import { loginThunk } from "../../redux/auth/operations";

import css from "./LoginForm.module.css";
import eyeOpen from "../../assets/img/eye.svg";
import eyeClosed from "../../assets/img/eye-closed.svg";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formikRef = useRef(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const initialValues = { email: "", password: "" };
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    formikRef.current?.resetForm();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginThunk(values)).unwrap();
      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo, { replace: true });
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <h3 className={css.title}>Login</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={formikRef}
        >
          {({ isSubmitting }) => (
          <Form>
            <div className={css.inputGroup}>
              <label htmlFor={emailId} className={css.label}>Email</label>
              <Field name="email" type="email" id={emailId} className={css.input} />
              <ErrorMessage name="email" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor={passwordId} className={css.label}>Password</label>

              <div className={css.passwordEye}>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id={passwordId}
                  className={css.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={css.eyeButton}
                >
                  <img
                    src={showPassword ? eyeOpen : eyeClosed}
                    alt={showPassword ? "Show password" : "Hide password"}
                  />
                </button>
              </div>

              <ErrorMessage name="password" component="div" className={css.error} />
            </div>

            <button type="submit" className={css.btn} disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
          )}
        </Formik>

        <p className={css.text}>
          Don't have an account?{" "}
          <NavLink to="/register" className={css.navlink}>Register</NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;


