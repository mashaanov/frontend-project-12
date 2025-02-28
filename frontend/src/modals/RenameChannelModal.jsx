import React, { useRef, useEffect } from "react";
import { Modal, FormGroup, FormControl, Button } from "react-bootstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

const RenameChannelModal = ({ show, onHide, onSubmit, channelId }) => {
  const { t } = useTranslation();
  const renameChannelModelSchema = yup.object().shape({
    name: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.length"))
      .max(20, t("validation.length")),
  });
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: { name: "" },
    validateOnBlur: false,
    validationSchema: renameChannelModelSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({ name: values.name, channelId });
        resetForm();
        onHide();
      } catch (e) {
        console.error("Ошибка добавления канала:", e);
      }
    },
  });

  useEffect(() => {
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("chatList.modals.renameChannel.title")}</Modal.Title>
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
              {t("chatList.modals.renameChannel.cancel")}
            </Button>
            <Button type="submit" className="btn btn-primary">
              {t("chatList.modals.renameChannel.submit")}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
