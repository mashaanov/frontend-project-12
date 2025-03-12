import React, { useRef, useEffect } from 'react';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  ModalTitle,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

const AddChannelModal = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation();

  // Схема валидации для формы добавления канала
  const addChannelModelSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('validation.required'))
      .min(3, t('validation.length'))
      .max(20, t('validation.length'))
      .test(
        'trimmed',
        t('validation.required'),
        (value) => value.trim().length > 0,
      ),
  });
  const inputRef = useRef();
  // Форма с помощью Formik
  const formik = useFormik({
    initialValues: { name: '' },
    validateOnBlur: false,
    validationSchema: addChannelModelSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({ name: values.name });
        resetForm();
        onHide();
      } catch (e) {
        // Логирование ошибки
        console.error('Ошибка добавления канала:', e);
      }
    },
  });

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus(); // Явный фокус на поле ввода
    }
  }, [show]); // Фокусируемся при изменении состояния show

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <ModalTitle>{t('chatList.modals.addChannel.title')}</ModalTitle>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              type="text"
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              autoFocus
            />
            <label className="visually-hidden" htmlFor="name">
              Имя канала
            </label>
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback d-block">
                {formik.errors.name}
              </div>
            )}
          </FormGroup>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn btn-secondary"
              onClick={onHide}
            >
              {t('chatList.modals.addChannel.cancel')}
            </Button>
            <Button type="submit" className="btn btn-primary">
              {t('chatList.modals.addChannel.submit')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
