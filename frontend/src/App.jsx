import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/log-in/LoginPage.jsx";
import Signup from "./pages/sign-up/SignupPage.jsx";
import Chat from "./pages/homepage/ChatPage.jsx";
import NotFound from "./pages/not-found/notFound.jsx";
import NavBar from "./components/Navbar/Navbar.jsx";
import { initializeAuth } from "./store/slices/authSlice.js";
import React from "react";
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react"; // Provider imports 'rollbar'
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store.js";

const rollbarConfig = {
  accessToken: "6b20a85d609b4f5f828ebc6a32158aa1",
  environment: "testenv",
};

function TestError() {
  useEffect(() => {
    throw new Error("Тестовая ошибка для Rollbar");
  }, []);

  return <div>Этот компонент вызовет ошибку</div>;
}

// Функция проверки авторизации
const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

// Защищенный маршрут
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

// Навбар отображается только на определенных страницах
const supportedPaths = ["/login", "/signup"];
const NavBarContainerWithVisibility = () => {
  const location = useLocation();
  return supportedPaths.includes(location.pathname) ||
    location.pathname === "/" ? (
    <NavBar />
  ) : null;
};

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth()); // Перенесли useEffect внутрь MainLayout
  }, [dispatch]);

  return (
    <div className="d-flex flex-column h-100 styles[appContainer]">
      <NavBarContainerWithVisibility />
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Chat />} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <TestError />
        <ReduxProvider store={store}>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
}
