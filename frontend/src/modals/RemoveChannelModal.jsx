import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import log from 'loglevel';

const RemoveChannelModal = ({
  show,
  onHide,
  onSubmit,
  channelId,
}) => {
  log.setLevel('info'); 
  const { t } = useTranslation();
  const handleSubmit = async () => {
    try {
      await onSubmit({ channelId });
      onHide();
    } catch (e) {
      log.error('Ошибка при удалении канала:', e);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatList.modals.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('chatList.modals.removeChannel.warning')}</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            type="button"
            className="me-2 btn btn-secondary"
            onClick={onHide}
          >
            {t('chatList.modals.removeChannel.cancel')}
          </Button>
          <Button
            type="submit"
            className="btn btn-danger"
            onClick={() => handleSubmit()}
          >
            {t('chatList.modals.removeChannel.submit')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default RemoveChannelModal;
