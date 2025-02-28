import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  fetchMessages,
  removeMessage,
} from "../../store/slices/chatSlice";
import { socket } from "../../socket.js";
import * as yup from "yup";
import { useFormik } from "formik";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import leoProfanity from "leo-profanity";
import { getPluralMessages } from "../../utils/getPluralMessages.js";

leoProfanity.add(leoProfanity.getDictionary("ru"));

// Схема валидации для формы
const chatAreaModelSchema = yup.object().shape({
  message: yup.string().required(""),
});

const ChatArea = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { username } = useSelector((store) => ({
    username: store.auth.username,
  }));

  const selectMessagesByChannelId = (state, channelId) => {
    return state.chat.messages.byChannelId[channelId] || [];
  };

  const { activeChannelId, channels } = useSelector((store) => ({
    activeChannelId: store.chat?.activeChannelId || null,
    channels: store.chat?.channels || { entities: {}, ids: [] },
  }));

  const messages = useSelector((state) =>
    selectMessagesByChannelId(state, activeChannelId)
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const handleGetMessages = () => {
      dispatch(fetchMessages());
    };

    socket.on("newMessage", handleGetMessages);

    return () => {
      socket.off("newMessage", handleGetMessages);
    };
  }, [dispatch]);

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
    initialValues: { message: "" },
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
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="text-break mb-2"
            >
              <b>{msg.username}:</b> {msg.body}
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
                placeholder={t("chatArea.messageInput.placeholder")}
                className="border-0 p-0 ps-2 form-control"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button type="submit" className="btn btn-group-vertical">
                <FiSend style={{ fontSize: "20px", color: "#6f42c1" }} />
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
