import React from "react";
import signupImage from "../../assets/img/signup.png";
import SignupForm from "../../containers/SignUpContainer.jsx";

const SignupPage = () => (
  <div className="row justify-content-center align-content-center h-100">
    <div className="col-12 col-md-8 col-xxl-6">
      <div className="card shadow-sm">
        <div className="card-body row p-5">
          {/* Приветственное изображение */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <img
              src={signupImage}
              alt="Приветственное изображение"
              className="mb-4 rounded-circle"
              style={{
                width: "260px",
                height: "auto",
                position: "relative",
                top: "-30px",
              }}
            />
          </div>
          {/* Форма */}
          <SignupForm />
        </div>
      </div>
    </div>
  </div>
);

export default SignupPage;
