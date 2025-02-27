import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./src/store/store.js";
import "./global.scss";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./src/i18n.js";

const App = React.lazy(() => import("./src/App.jsx"));

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
      >
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
