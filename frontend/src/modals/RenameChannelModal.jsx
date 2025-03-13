import React, { useRef, useEffect } from 'react';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

const RenameChannelModal = ({
  show,
  onHide,
  onSubmit,
  channelId,
  currentChannelName,
}) => {
  const { t } = useTranslation();
  const renameChannelModelSchema = yup.object().shape({
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
  const formik = useFormik({
    initialValues: { name: currentChannelName || '' },
    enableReinitialize: true,
    validateOnBlur: false,
    validationSchema: renameChannelModelSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({ name: values.name, channelId });
        resetForm();
        onHide();
      } catch (e) {
        console.error('Ошибка добавления канала:', e);
      }
    },
  });

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatList.modals.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <label className="visually-hidden" id="name-label" htmlFor="name">
              Имя канала
            </label>
            <FormControl
              id="name"
              type="text"
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              autoFocus
              aria-labelledby="name-label"
            />
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
              {t('chatList.modals.renameChannel.cancel')}
            </Button>
            <Button type="submit" className="btn btn-primary">
              {t('chatList.modals.renameChannel.submit')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
