import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import s from "./RegisterForm.module.css";

import { useState } from "react";
import IconEye from "../../assets/img/eye.svg";
import IconEyeClosed from "../../assets/img/eye-closed.svg";
import { toast } from "react-hot-toast";

import { useDispatch } from "react-redux";
import { registerThunk } from "../../redux/auth/operations";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .max(64, "Email must be at most 64 characters")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please repeat your password"),
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    dispatch(registerThunk(payload))
      .unwrap()
      .then(() => {
        toast.success("Registration successful!");
        resetForm();
        navigate("/profile"); // 👉 после регистрации открыть личный кабинет
      })
      .catch((error) => {
        toast.error(error || "Registration failed");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={s.registerContainer}>
      <h2 className={s.title}>Register</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={s.registerForm}>
            {/* NAME */}
            <div className={s.fieldWrapper}>
              <label className={s.labelForm} htmlFor="name">
                Enter your name
              </label>
              <Field
                className={s.fieldForm}
                id="name"
                name="name"
                type="text"
                placeholder="Name"
              />
              <ErrorMessage name="name" component="div" className={s.error} />
            </div>

            {/* EMAIL */}
            <div className={s.fieldWrapper}>
              <label className={s.labelForm} htmlFor="email">
                Enter your email address
              </label>
              <Field
                className={s.fieldForm}
                id="email"
                name="email"
                type="email"
                placeholder="email@gmail.com"
              />
              <ErrorMessage name="email" component="div" className={s.error} />
            </div>

            {/* PASSWORD */}
            <div className={s.fieldWrapper}>
              <label className={s.labelForm} htmlFor="password">
                Create a strong password
              </label>
              <div className={s.passwordWrapper}>
                <Field
                  className={s.fieldForm}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img
                    src={showPassword ? IconEye : IconEyeClosed}
                    alt="toggle password"
                    width="20"
                    height="20"
                  />
                </button>
              </div>
              <ErrorMessage name="password" component="div" className={s.error} />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={s.fieldWrapper}>
              <label className={s.labelForm} htmlFor="confirmPassword">
                Repeat your password
              </label>
              <div className={s.passwordWrapper}>
                <Field
                  className={s.fieldForm}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <img
                    src={showConfirmPassword ? IconEye : IconEyeClosed}
                    alt="toggle confirm password"
                    width="20"
                    height="20"
                  />
                </button>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={s.error}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className={s.createBtn}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Create account"}
            </button>

            <p className={s.descAcc}>
              Already have an account?{" "}
              <Link to="/login" className={s.loginLink}>
                Log in
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;





