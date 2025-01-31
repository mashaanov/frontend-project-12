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

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

const MainLayout = () => {
  return (
    <div className="d-flex flex-column h-100 styles[appContainer]">
      <NavBarContainerWithVisibility />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
    </div>
  );
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
