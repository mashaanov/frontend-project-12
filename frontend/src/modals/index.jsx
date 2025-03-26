import log from 'loglevel';

import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';

const modals = {
  addChannel: AddChannelModal,
  removeChannel: RemoveChannelModal,
  renameChannel: RenameChannelModal,
};

export default (modalName) => {
  log.setLevel('warn'); 
  const ModalComponent = modals[modalName];
  if (!ModalComponent) {
    log.error(`Модальное окно с именем "${modalName}" не найдено.`);
    return null;
  }
  return ModalComponent;
};
