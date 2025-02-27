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

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const supportedPaths = ["/login", "/signup"];

// Компонент для отображения NavBarContainer только на нужных страницах
const NavBarContainerWithVisibility = () => {
  const location = useLocation();
  const isPathSupported =
    supportedPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname === "/";
  return isPathSupported ? <NavBar /> : null;
};

const MainLayout = () => {
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
