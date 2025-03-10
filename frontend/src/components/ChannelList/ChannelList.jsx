import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setActiveChannel,
  addChannel,
  renameChannel,
  removeChannel,
  fetchChannels,
} from "../../store/slices/chatSlice";
import styles from "../ChannelList/ChannelList.module.scss";
import cn from "classnames";
import getModal from "../../modals/index.jsx";
import { useDependencies } from "../../contexts/DependenciesContext.jsx";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

const ChannelList = () => {
  const { socket, leoProfanity } = useDependencies();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, activeChannelId } = useSelector((store) => ({
    channels: store.chat?.channels || { entities: {}, ids: [] },
    activeChannelId: store.chat?.activeChannelId || null,
  }));

  const [modalInfo, setModalInfo] = useState({
    type: null,
    channelId: null,
    currentChannelName: null,
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const hideModal = () => setModalInfo({ type: null, channelId: null });
  const showModal = (type, channelId = null) => {
    setModalInfo({ type, channelId });
    setOpenDropdownId(null);
  };

  const handleAddChannel = (name) => {
    const filteredChannelName = leoProfanity.clean(name);
    dispatch(addChannel(filteredChannelName))
      .unwrap()
      .then((newChannel) => {
        dispatch(setActiveChannel(newChannel.id));
        toast.success(t("notifications.channelAdded"));
      })
      .catch((error) => {
        console.error("Ошибка при добавлении канала:", error);
        toast.error(t("notifications.errors.dataLoading"));
      });
  };

  // Подписка на событие удаления и переименования канала
  useEffect(() => {
    const handleRenameChannel = () => {
      dispatch(fetchChannels()); // Перезапрашиваем каналы
    };

    const handleRemoveChannel = () => {
      dispatch(fetchChannels()); // Перезапрашиваем каналы
    };

    socket.on("renameChannel", handleRenameChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
      socket.off("renameChannel", handleRenameChannel);
      socket.off("removeChannel", handleRemoveChannel);
    };
  }, [dispatch]);

  useEffect(() => {
    if (activeChannelId) {
      localStorage.setItem("activeChannelId", activeChannelId);
    }
  }, [activeChannelId]);

  useEffect(() => {
    dispatch(fetchChannels())
      .unwrap()
      .then(() => {
        // Извлекаем activeChannelId из localStorage
        const savedActiveChannelId = localStorage.getItem("activeChannelId");
        const generalChannelId = channels.ids.find(
          (id) => channels.entities[id]?.name === "general"
        );

        // Если сохраненный канал существует, выбираем его, иначе выбираем general
        if (savedActiveChannelId && channels.entities[savedActiveChannelId]) {
          dispatch(setActiveChannel(savedActiveChannelId));
        } else if (generalChannelId) {
          dispatch(setActiveChannel(generalChannelId));
        }
      });
  }, [dispatch]);

  const handleRenameChannel = (newName, id) => {
    dispatch(renameChannel({ name: newName, channelId: id }))
      .unwrap()
      .then(() => {
        // Отправляем событие через веб-сокеты
        socket.emit("renameChannel", { channelId: id, newName });
        toast.success(t("notifications.channelRenamed"));
      })
      .catch((error) => {
        console.error("Ошибка при переименовании канала:", error);
        toast.error(t("notifications.errors.dataLoading"));
      });
  };

  const handleRemoveChannel = (id) => {
    dispatch(removeChannel(id))
      .unwrap()
      .then(() => {
        const generalChannelId = channels.ids.find(
          (channelId) => channels.entities[channelId]?.name === "general"
        );
        if (id === activeChannelId && generalChannelId)
          dispatch(setActiveChannel(generalChannelId));
        toast.success(t("notifications.channelRemoved")); // Уведомление об успешном удалении
      })
      .catch((error) => {
        console.error("Ошибка при удалении канала:", error);
        toast.error(t("notifications.errors.dataLoading")); // Уведомление об ошибке
      });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  // Загрузка каналов при монтировании
  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  // Подписка на событие нового канала
  useEffect(() => {
    const handleGetChannels = () => {
      dispatch(fetchChannels());
    };

    socket.on("newChannel", handleGetChannels);

    return () => {
      socket.off("newChannel", handleGetChannels);
    };
  }, [dispatch]);

  // Обработка клика вне выпадающего меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const renderModal = () => {
    if (!modalInfo.type) return null;
    const Component = getModal(modalInfo.type);
    return (
      <Component
        show={!!modalInfo.type}
        onHide={hideModal}
        onSubmit={(data) => {
          if (modalInfo.type === "addChannel") handleAddChannel(data.name);
          if (modalInfo.type === "renameChannel")
            handleRenameChannel(data.name, modalInfo.channelId);
          if (modalInfo.type === "removeChannel")
            handleRemoveChannel(modalInfo.channelId);
        }}
        channelId={modalInfo.channelId}
        currentChannelName={channels.entities[modalInfo.channelId]?.name}
      />
    );
  };

  const renderChannelOptions = (id) => {
    return (
      openDropdownId === id && (
        <div
          ref={dropdownRef}
          className="dropdown-menu show"
          style={{
            position: "absolute",
            inset: "0px 0px auto auto",
            transform: "translate3d(0px, 40px, 0px)",
          }}
        >
          <button
            className="dropdown-item"
            onClick={() =>
              showModal("removeChannel", id)
            }
          >
            Удалить
          </button>
          <button
            className="dropdown-item"
            onClick={() =>
              showModal("renameChannel", id)
            }
          >
            Переименовать
          </button>
        </div>
      )
    );
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t("chatList.title")}</b>
        <button
          type="button"
          className={cn(styles["btn-custom"], "p-0 btn btn-group-vertical")}
          onClick={() => showModal("addChannel")}
        >
          <Plus size={18} />
          <span className="visually-hidden">+</span>
        </button>
      </div>

      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.ids.map((id) => {
          const channel = channels.entities[id];
          return (
            <li
              key={channel.id}
              className="nav-item w-100 d-flex align-items-center"
            >
              {channel.removable === false ? (
                <button
                  type="button"
                  className={cn(
                    "w-100 rounded-0 text-start btn",
                    activeChannelId === channel.id ? "btn-secondary" : "btn"
                  )}
                  onClick={() => dispatch(setActiveChannel(channel.id))}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              ) : (
                <div className="d-flex show dropdown btn-group w-100">
                  <button
                    type="button"
                    className={cn(
                      "w-100 rounded-0 text-start text-truncate btn",
                      activeChannelId === channel.id ? "btn-secondary" : "btn"
                    )}
                    onClick={() => dispatch(setActiveChannel(channel.id))}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-grow-0 dropdown-toggle dropdown-toggle-split btn",
                      activeChannelId === channel.id ? "btn-secondary" : "btn"
                    )}
                    onClick={() => toggleDropdown(channel.id)}
                  >
                    <span class="visually-hidden">Управление каналом</span>
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
