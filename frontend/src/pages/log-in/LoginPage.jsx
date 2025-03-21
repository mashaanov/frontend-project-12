import React from 'react';
import { useTranslation } from 'react-i18next';

import welcomeImage from '../../assets/img/welcome-image.jpg';
import LoginForm from '../../containers/LoginFormContainer.jsx';

import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body row p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img
                src={welcomeImage}
                alt="Приветственное изображение"
                className="mb-4 rounded-circle"
                style={{ width: '200px', height: 'auto' }}
              />
            </div>
            <LoginForm />
          </div>
          <div className="card-footer p-4 bg-light">
            <div className="text-center">
              <span>
                {t('login.signupText')}
              </span>
              <a href="/signup" className={styles['signup-link']}>
                {t('login.signupLink')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
