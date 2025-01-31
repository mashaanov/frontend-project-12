const apiPath = "/api/v1";

export default {
  getChannels: () => `${apiPath}/channels`,
  getMessages: () => `${apiPath}/messages`,
  loginPath: () => `${apiPath}/login`,
  signupPath: () => `${apiPath}/signup`,
};
