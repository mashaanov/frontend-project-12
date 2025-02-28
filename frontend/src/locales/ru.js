const ru = {
  login: {
    title: "Войти",
    username: {
      label: "Ваш ник",
      placeholder: "Ваш ник",
    },
    password: {
      label: "Пароль",
      placeholder: "Пароль",
    },
    authFailed: "Неверные имя пользователя или пароль",
    submitButton: {
      loading: "Загрузка...",
      default: "Войти",
    },
    signupText: "Нет аккаунта? ",
    signupLink: "Регистрация",
  },
  signUp: {
    title: "Регистрация",
    username: {
      label: "Имя пользователя",
      placeholder: "Имя пользователя",
    },
    password: {
      label: "Пароль",
      placeholder: "Пароль",
    },
    confirmPassword: {
      label: "Подтвердите пароль",
      placeholder: "Подтвердите пароль",
    },
    authFailed: "Такой пользователь уже существует",
    submitButton: {
      loading: "Загрузка...",
      default: "Зарегистрироваться",
    },
    validation: {
      required: "Обязательное поле",
      passwordMatch: "Пароли не совпадают",
    },
  },
  chatList: {
    title: "Каналы",
    modals: {
      addChannel: {
        title: "Добавить канал",
        cancel: "Отменить",
        submit: "Добавить",
      },
      renameChannel: {
        title: "Переименовать канал",
        cancel: "Отменить",
        submit: "Отправить",
      },
      removeChannel: {
        title: "Удалить канал",
        warning: "Уверены?",
        submit: "Удалить",
        cancel: "Отменить",
      },
    },
  },
  chatArea: {
    messageInput: {
      placeholder: "Введите сообщение...",
    },
  },
  validation: {
    required: "Обязательное поле",
    length: "От 3 до 20 символов",
    passwordLength: "Не менее 6 символов",
    passwordMatch: "Пароли должны совпадать",
  },
  navbar: {
    title: "Hexlet Chat",
    logout: "Выйти",
  },
  notifications: {
    channelAdded: "Канал создан",
    channelRemoved: "Канал удалён",
    channelRenamed: "Канал переименован",
    errors: {
      network: "Ошибка сети. Пожалуйста, проверьте соединение.",
      dataLoading: "Не удалось загрузить данные.",
    },
  },
  messagesCount:
    "{{count, plural, one {{{count}} сообщение} few {{{count}} сообщения} many {{{count}} сообщений} other {{{count}} сообщений}}}",
};

export default ru;
