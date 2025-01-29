import React from "react";
import welcomeImage from "../../assets/img/welcome-image.jpg";
import LoginForm from "../../containers/LoginFormContainer.jsx";

const LoginPage = () => (
  <div className="row justify-content-center align-content-center h-100">
    <div className="col-12 col-md-8 col-xxl-6 mt-5">
      <div className="card shadow-sm">
        <div className="card-body row p-5">
          {/* Приветственное изображение */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <img
              src={welcomeImage}
              alt="Приветственное изображение"
              className="mb-4 rounded-circle"
              style={{ width: "200px", height: "auto" }}
            />
          </div>
          {/* Форма */}
          <LoginForm />
        </div>
        <div className="card-footer p-4 bg-light">
          <div className="text-center">
            <span>Нет аккаунта? </span>
            <a href="/signup">Регистрация</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
