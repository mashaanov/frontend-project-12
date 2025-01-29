import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App/App.jsx";
import store from "./src/store/store.js";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>
  </React.StrictMode>
);
