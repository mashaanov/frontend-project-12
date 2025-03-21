import React from 'react';
import { Form, Field } from 'formik';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from './SignUpForm.module.scss';

const SignUpView = ({
  regFailed,
  inputRef,
  isSubmitting,
  errors,
  touched,
}) => {
  const { t } = useTranslation();
  return (
    <Form className="col-12 col-md-6 mt-md-0">
      <h1 className="text-center mb-4">{t('signUp.title')}</h1>

      <div className="form-floating mb-3">
        <Field
          name="username"
          autoComplete="username"
          placeholder={t('signUp.username.placeholder')}
          id="username"
          innerRef={(el) => {
            // eslint-disable-next-line no-param-reassign
            inputRef.current = el;
          }}
          className={cn('form-control', styles['input-username'], {
            [styles['input-error']]:
              (errors.username && touched.username) || regFailed,
            'is-invalid': (errors.username && touched.username) || regFailed,
          })}
          style={{ backgroundImage: 'none' }}
        />
        <label htmlFor="username">{t('signUp.username.label')}</label>
        {!regFailed && errors.username && touched.username && (
          <div className="invalid-tooltip" style={{ top: '75%' }}>
            {errors.username}
          </div>
        )}
      </div>

      <div className="form-floating mb-3">
        <Field
          name="password"
          autoComplete="current-password"
          placeholder={t('signUp.password.placeholder')}
          type="password"
          id="password"
          className={cn('form-control', styles['input-password'], {
            [styles['input-error']]:
              (errors.password && touched.password) || regFailed,
            'is-invalid': (errors.password && touched.password) || regFailed,
          })}
          style={{ backgroundImage: 'none' }}
        />
        <label htmlFor="password">{t('signUp.password.label')}</label>
        {!regFailed && errors.password && touched.password && (
          <div className="invalid-tooltip" style={{ top: '75%' }}>
            {errors.password}
          </div>
        )}
      </div>
      <div className="form-floating mb-4">
        <Field
          name="confirmPassword"
          autocomplete="new-password"
          placeholder={t('signUp.confirmPassword.placeholder')}
          type="password"
          id="confirmPassword"
          className={cn('form-control', styles['input-confirmPassword'], {
            [styles['input-error']]:
              (errors.confirmPassword && touched.confirmPassword) || regFailed,
            'is-invalid':
              (errors.confirmPassword && touched.confirmPassword) || regFailed,
          })}
          style={{ backgroundImage: 'none' }}
        />
        <label htmlFor="confirmPassword">
          {t('signUp.confirmPassword.label')}
        </label>
        {!regFailed && errors.confirmPassword && touched.confirmPassword && (
          <div className="invalid-tooltip" style={{ top: '75%' }}>
            {errors.confirmPassword}
          </div>
        )}
        {regFailed && (
          <div className="invalid-tooltip" style={{ top: '75%' }}>
            {t('signUp.authFailed')}
          </div>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting
          ? t('signUp.submitButton.loading')
          : t('signUp.submitButton.default')}
      </button>
    </Form>
  );
};

export default SignUpView;
