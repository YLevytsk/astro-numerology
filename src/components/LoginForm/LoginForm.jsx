import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useId, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../../redux/auth/operations";
import css from "./LoginForm.module.css";
import eyeOpen from "../../assets/img/eye.svg";
import eyeClosed from "../../assets/img/eye-closed.svg";
import { NavLink } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const initialValues = { email: "", password: "" };
  const emailId = useId();
  const passwordId = useId();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    dispatch(loginThunk(values))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
        navigate("/profile");
      })
      .catch((error) => {
        toast.error(error || "Login failed");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <h3 className={css.title}>Login</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={css.inputGroup}>
                <label htmlFor={emailId} className={css.label}>
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  id={emailId}
                  className={css.input}
                  placeholder="your@email.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.inputGroup}>
                <label htmlFor={passwordId} className={css.label}>
                  Password
                </label>
                <div className={css.passwordEye}>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id={passwordId}
                    className={css.input}
                    placeholder="********"
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
                <ErrorMessage
                  name="password"
                  component="div"
                  className={css.error}
                />
              </div>

              <button
                type="submit"
                className={css.btn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className={css.text}>
          Don't have an account?{" "}
          <NavLink to="/register" className={css.navlink}>
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
