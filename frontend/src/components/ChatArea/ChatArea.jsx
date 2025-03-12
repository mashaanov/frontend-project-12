import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import {
  addMessage,
  fetchMessages,
  removeMessage,
} from '../../store/slices/chatSlice';
import { getPluralMessages } from '../../utils/getPluralMessages.js';
import { useDependencies } from '../../contexts/DependenciesContext.jsx';

// Схема валидации для формы
const chatAreaModelSchema = yup.object().shape({
  message: yup.string().required(''),
});

const ChatArea = () => {
  const { leoProfanity } = useDependencies();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { username } = useSelector((store) => ({
    username: store.auth.username,
  }));

  const selectMessagesByChannelId = (state, channelId) => state.chat.messages.byChannelId[channelId] || [];

  const { activeChannelId, channels } = useSelector((store) => ({
    activeChannelId: store.chat?.activeChannelId || null,
    channels: store.chat?.channels || { entities: {}, ids: [] },
  }));

  const messages = useSelector((state) =>
    selectMessagesByChannelId(state, activeChannelId),
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  // Прокрутка к последнему сообщению при изменении списка сообщений
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop
        = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (values, { resetForm }) => {
    const filteredMessage = leoProfanity.clean(values.message);
    const newMessage = {
      body: filteredMessage,
      channelId: activeChannelId,
      username: username,
    };

    dispatch(addMessage(newMessage));
    resetForm();
  };

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: chatAreaModelSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          {channels.ids.length > 0 && activeChannelId && (
            <>
              <p className="m-0">
                <b># {channels.entities[activeChannelId]?.name}</b>
              </p>
              <span className="text-muted">
                {getPluralMessages(messages.length)}
              </span>
            </>
          )}
        </div>
        <div
          id="messages-box"
          className="chat-messages overflow-auto px-5"
          ref={messagesContainerRef}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="text-break mb-2 d-flex align-items-center justify-content-between"
            >
              <span>
                <b>{msg.username}:</b> {msg.body}
              </span>
              <div>
                <button
                  className="btn btn-link text-danger p-0 ms-2"
                  onClick={() => {
                    dispatch(removeMessage(msg.id));
                  }}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <form
            className="py-1 border rounded-2"
            onSubmit={formik.handleSubmit}
          >
            <div className="input-group">
              <input
                ref={inputRef}
                name="message"
                type="text"
                aria-label="Новое сообщение"
                placeholder={t('chatArea.messageInput.placeholder')}
                className="border-0 p-0 ps-2 form-control"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button type="submit" className="btn btn-group-vertical">
                <FiSend style={{ fontSize: '20px', color: '#6f42c1' }} />
              </button>
            </div>
            {formik.touched.message && formik.errors.message ? (
              <div className="text-danger small mt-2">
                {formik.errors.message}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
