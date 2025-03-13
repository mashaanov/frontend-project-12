const apiPath = '/api/v1';

export default {
  loginPath: () => `${apiPath}/login`,
  signupPath: () => `${apiPath}/signup`,
  getChannels: () => `${apiPath}/channels`,
  addChannel: () => `${apiPath}/channels`,
  renameChannel: (id) => `${apiPath}/channels/${id}`,
  removeChannel: (id) => `${apiPath}/channels/${id}`,
  getMessages: () => `${apiPath}/messages`,
  addMessage: () => `${apiPath}/messages`,
  editMessage: (id) => `${apiPath}/messages/${id}`,
  removeMessage: (id) => `${apiPath}/messages/${id}`,
};
