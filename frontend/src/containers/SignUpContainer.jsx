import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import log from 'loglevel';

import { signup } from '../store/slices/authSlice';
import routes from '../routes.js';
import SignupView from '../components/SignUpForm/SignUpFormView.jsx';

const SignUpFormContainer = () => {
  log.setLevel('warn');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef();
  const [regFailed, setRegFailed] = useState(false);
  const { t } = useTranslation();

  const logInFormSchema = yup.object().shape({
    username: yup
      .string()
      .required(t('validation.required'))
      .min(3, t('validation.length'))
      .max(20, t('validation.length')),
    password: yup
      .string()
      .required(t('validation.required'))
      .min(6, t('validation.passwordLength')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('validation.passwordMatch')),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmitting = async (values, { setSubmitting, resetForm }) => {
    setRegFailed(false);
    try {
      const res = await axios.post(routes.signupPath(), values);
      localStorage.setItem('token', res.data.token);
      dispatch(signup(res.data));
      navigate(location.state?.from || '/');
      resetForm();
    } catch (e) {
      if (e.response?.status === 409) {
        setRegFailed(true);
        inputRef.current?.select();
      } else {
        log.error('Registration failed:', e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '', confirmPassword: '' }}
      validationSchema={logInFormSchema}
      onSubmit={handleSubmitting}
    >
      {(formikProps) => (
        <SignupView
          isSubmitting={formikProps.isSubmitting}
          errors={formikProps.errors}
          touched={formikProps.touched}
          regFailed={regFailed}
          inputRef={inputRef}
        />
      )}
    </Formik>
  );
};

export default SignUpFormContainer;
