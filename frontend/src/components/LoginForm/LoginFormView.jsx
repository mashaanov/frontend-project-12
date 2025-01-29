import React from "react";
import { Form, Field } from "formik";
import cn from "classnames";
import styles from "../LoginForm/LoginForm.module.scss";

const LoginFormView = ({
  authFailed,
  inputRef,
  isSubmitting,
  errors,
  touched,
}) => {
  return (
    <Form className="col-12 col-md-6 mt-md-0">
      <h1 className="text-center mb-4">Войти</h1>

      {/* Поле username */}
      <div className="form-floating mb-3">
        <Field
          name="username"
          autoComplete="username"
          placeholder="Ваш ник"
          id="username"
          innerRef={(el) => inputRef.current = el}
          className={cn("form-control", styles["input-username"], {
            [styles["input-error"]]:
              (errors.username && touched.username) || authFailed,
            "is-invalid": (errors.username && touched.username) || authFailed,
          })}
          style={{ backgroundImage: "none" }}
        />
        <label htmlFor="username">Ваш ник</label>
        {/* Ошибка для поля username */}
        {!authFailed && errors.username && touched.username && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {errors.username}
          </div>
        )}
      </div>

      {/* Поле password */}
      <div className="form-floating mb-4">
        <Field
          name="password"
          autoComplete="current-password"
          placeholder="Пароль"
          type="password"
          id="password"
          className={cn("form-control", styles["input-username"], {
            [styles["input-error"]]:
              (errors.password && touched.password) || authFailed,
            "is-invalid": (errors.password && touched.password) || authFailed,
          })}
          style={{ backgroundImage: "none" }}
        />
        <label htmlFor="password">Пароль</label>
        {/* Ошибка для поля password */}
        {!authFailed && errors.password && touched.password && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {errors.password}
          </div>
        )}
        {/* Ошибка авторизации */}
        {authFailed && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            Неверные имя пользователя или пароль
          </div>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Загрузка..." : "Войти"}
      </button>
    </Form>
  );
};

export default LoginFormView;
