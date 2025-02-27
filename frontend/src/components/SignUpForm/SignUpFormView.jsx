import React from "react";
import { Form, Field } from "formik";
import cn from "classnames";
import styles from "./SignUpForm.module.scss";
import { useTranslation } from "react-i18next";

const SignUpView = ({ regFailed, inputRef, isSubmitting, errors, touched }) => {
  const { t } = useTranslation();
  return (
    <Form className="col-12 col-md-6 mt-md-0">
      <h1 className="text-center mb-4">{t("sign-up.title")}</h1>

      {/* Поле username */}
      <div className="form-floating mb-3">
        <Field
          name="username"
          autoComplete="username"
          placeholder={t("sign-up.username.placeholder")}
          id="username"
          innerRef={(el) => (inputRef.current = el)}
          className={cn("form-control", styles["input-username"], {
            [styles["input-error"]]:
              (errors.username && touched.username) || regFailed,
            "is-invalid": (errors.username && touched.username) || regFailed,
          })}
          style={{ backgroundImage: "none" }}
        />
        <label htmlFor="username">{t("sign-up.username.label")}</label>
        {/* Ошибка для поля username */}
        {!regFailed && errors.username && touched.username && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {errors.username}
          </div>
        )}
      </div>

      {/* Поле password */}
      <div className="form-floating mb-3">
        <Field
          name="password"
          autoComplete="current-password"
          placeholder={t("sign-up.password.placeholder")}
          type="password"
          id="password"
          className={cn("form-control", styles["input-password"], {
            [styles["input-error"]]:
              (errors.password && touched.password) || regFailed,
            "is-invalid": (errors.password && touched.password) || regFailed,
          })}
          style={{ backgroundImage: "none" }}
        />
        <label htmlFor="password">{t("sign-up.password.label")}</label>
        {/* Ошибка для поля password */}
        {!regFailed && errors.password && touched.password && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {errors.password}
          </div>
        )}
      </div>
      <div className="form-floating mb-4">
        <Field
          name="confirmPassword"
          autocomplete="new-password"
          placeholder={t("sign-up.confirmPassword.placeholder")}
          type="password"
          id="confirmPassword"
          className={cn("form-control", styles["input-confirmPassword"], {
            [styles["input-error"]]:
              (errors.confirmPassword && touched.confirmPassword) || regFailed,
            "is-invalid":
              (errors.confirmPassword && touched.confirmPassword) || regFailed,
          })}
          style={{ backgroundImage: "none" }}
        />
        <label htmlFor="confirmPassword">
          {t("sign-up.confirmPassword.label")}
        </label>
        {/* Ошибка для поля password */}
        {!regFailed && errors.confirmPassword && touched.confirmPassword && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {errors.confirmPassword}
          </div>
        )}
        {/* Ошибка регистрации */}
        {regFailed && (
          <div className="invalid-tooltip" style={{ top: "75%" }}>
            {t("sign-up.authFailed")}
          </div>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting
          ? t("sign-up.submitButton.loading")
          : t("sign-up.submitButton.default")}
      </button>
    </Form>
  );
};

export default SignUpView;
