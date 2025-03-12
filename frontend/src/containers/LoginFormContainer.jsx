import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { login } from '../store/slices/authSlice';
import routes from '../routes.js';
import LoginFormView from '../components/LoginForm/LoginFormView.jsx';

const LoginFormContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const { t } = useTranslation();

  const logInFormSchema = yup.object().shape({
    username: yup.string().required(t('validation.required')),
    password: yup.string().required(t('validation.required')),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmitting = async (values, { setSubmitting, resetForm }) => {
    setAuthFailed(false);
    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('token', res.data.token);
      dispatch(login(res.data));
      navigate(location.state?.from || '/');
      resetForm();
    } catch (e) {
      if (e.response?.status === 401) {
        setAuthFailed(true);
        inputRef.current?.select();
        return;
      } else {
        console.error(e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={logInFormSchema}
      onSubmit={handleSubmitting}
    >
      {(formikProps) => (
        <LoginFormView
          isSubmitting={formikProps.isSubmitting}
          errors={formikProps.errors}
          touched={formikProps.touched}
          authFailed={authFailed}
          inputRef={inputRef}
        >
        </LoginFormView>
      )}
    </Formik>
  );
};

export default LoginFormContainer;
