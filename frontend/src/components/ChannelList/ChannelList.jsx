import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import log from 'loglevel';

import {
  setActiveChannel,
  addChannel,
  renameChannel,
  fetchChannels,
  removeChannel,
} from '../../store/slices/channelsSlice.js';
import {
  closeModal,
  openModal,
} from '../../store/slices/modalSlice.js';
import getModal from '../../modals/index.jsx';
import { useDependencies } from '../../contexts/DependenciesContext.jsx';

import styles from './ChannelList.module.scss';
log.setLevel('warn');

const ChannelList = () => {
  log.setLevel('warn');
  const { leoProfanity } = useDependencies();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, activeChannelId } = useSelector((store) => ({
    channels: store.channelsState?.channels || { entities: {}, ids: [] },
    activeChannelId: store.channelsState?.activeChannelId || null,
  }));
  const modal = useSelector((store) => store.modal);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const channelListRef = useRef(null);

  const hideModal = () => dispatch(closeModal());
  const showModal = (type, channelId = null) => {
    dispatch(openModal({ type, channelId }))
    setOpenDropdownId(null);
  };

  const handleAddChannel = (name) => {
    const isNameExists = channels.ids.some(
      (id) => channels.entities[id].name === name,
    );
    if (isNameExists) {
      toast.error(t('validation.channelExists'));
      return;
    }
    const filteredChannelName = leoProfanity.clean(name);
    dispatch(addChannel(filteredChannelName))
      .unwrap()
      .then((newChannel) => {
        dispatch(setActiveChannel(newChannel.id));
        toast.success(t('notifications.channelAdded'));
      })
      .catch((error) => {
        log.error('Ошибка при добавлении канала:', error);
        toast.error(t('notifications.errors.dataLoading'));
      });
  };

  useEffect(() => {
    if (activeChannelId) {
      localStorage.setItem('activeChannelId', activeChannelId);
    }
  }, [activeChannelId]);

  useEffect(() => {
    dispatch(fetchChannels())
      .unwrap()
      .then(() => {
        const savedActiveChannelId = localStorage.getItem('activeChannelId');
        const generalChannelId = channels.ids.find(
          (id) => channels.entities[id]?.name === 'general',
        );

        if (savedActiveChannelId && channels.entities[savedActiveChannelId]) {
          dispatch(setActiveChannel(savedActiveChannelId));
        } else if (generalChannelId) {
          dispatch(setActiveChannel(generalChannelId));
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (activeChannelId && channelListRef.current) {
      const activeChannelElement = channelListRef.current.querySelector(
        `[data-channel-id="${activeChannelId}"]`,
      );
      if (activeChannelElement) {
        activeChannelElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeChannelId]);

  const handleRenameChannel = (newName, id) => {
    dispatch(renameChannel({ name: newName, channelId: id }))
      .unwrap()
      .then(() => {
        toast.success(t('notifications.channelRenamed'));
      })
      .catch((error) => {
        log.error('Ошибка при переименовании канала:', error);
        toast.error(t('notifications.errors.dataLoading'));
      });
  };

  const handleRemoveChannel = (id) => {
    dispatch(removeChannel(id))
      .unwrap()
      .then(() => {
        const generalChannelId = channels.ids.find(
          (channelId) => channels.entities[channelId]?.name === 'general',
        );
        if (id === activeChannelId && generalChannelId) {
          dispatch(setActiveChannel(generalChannelId));
        }
        toast.success(t('notifications.channelRemoved'));
      })
      .catch((error) => {
        log.error('Ошибка при удалении канала:', error);
        toast.error(t('notifications.errors.dataLoading'));
      });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const renderModal = () => {
    if (!modal.type) return null;
    const Component = getModal(modal.type);
    return (
      <Component
        show={modal.isOpen}
        onHide={hideModal}
        onSubmit={(data) => {
          if (modal.type === 'addChannel') handleAddChannel(data.name);
          if (modal.type === 'renameChannel') {
            handleRenameChannel(data.name, modal.channelId);
          }
          if (modal.type === 'removeChannel') {
            handleRemoveChannel(modal.channelId);
          }
        }}
        channelId={modal.channelId}
        currentChannelName={channels.entities[modal.channelId]?.name}
      />
    );
  };

  const renderChannelOptions = (id) =>
    openDropdownId === id && (
      <div
        ref={dropdownRef}
        className="dropdown-menu show"
        style={{
          position: 'absolute',
          inset: '0px 0px auto auto',
          transform: 'translate3d(0px, 40px, 0px)',
        }}
      >
        <button
          type="button"
          className="dropdown-item"
          onClick={() => showModal('removeChannel', id)}
        >
          Удалить
        </button>
        <button
          type="button"
          className="dropdown-item"
          onClick={() => showModal('renameChannel', id)}
        >
          Переименовать
        </button>
      </div>
    );

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chatList.title')}</b>
        <button
          type="button"
          className={cn(styles['btn-custom'], 'p-0 btn btn-group-vertical')}
          onClick={() => showModal('addChannel')}
        >
          <Plus size={18} />
          <span className="visually-hidden">+</span>
        </button>
      </div>

      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        ref={channelListRef}
      >
        {channels.ids.map((id) => {
          const channel = channels.entities[id];
          return (
            <li
              key={channel.id}
              className="nav-item w-100 d-flex align-items-center"
              data-channel-id={channel.id}
            >
              {channel.removable === false ? (
                <button
                  type="button"
                  className={cn(
                    'w-100 rounded-0 text-start btn',
                    activeChannelId === channel.id ? 'btn-secondary' : 'btn',
                  )}
                  onClick={() => dispatch(setActiveChannel(channel.id))}
                >
                  <span className="me-1">#</span>
                  {channel.name.trim()}
                </button>
              ) : (
                <div className="d-flex show dropdown btn-group w-100">
                  <button
                    type="button"
                    className={cn(
                      'w-100 rounded-0 text-start text-truncate btn',
                      activeChannelId === channel.id ? 'btn-secondary' : 'btn',
                    )}
                    onClick={() => dispatch(setActiveChannel(channel.id))}
                  >
                    <span className="me-1">#</span>
                    {channel.name.trim()}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex-grow-0 dropdown-toggle dropdown-toggle-split btn',
                      activeChannelId === channel.id ? 'btn-secondary' : 'btn',
                    )}
                    onClick={() => toggleDropdown(channel.id)}
                  >
                    <span className="visually-hidden">Управление каналом</span>
                  </button>
                  {renderChannelOptions(channel.id)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {renderModal()}
      <ToastContainer />
    </div>
  );
};

export default ChannelList;
