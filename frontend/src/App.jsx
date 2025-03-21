import React, { useEffect } from 'react';
import { useDispatch, Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import Login from './pages/log-in/LoginPage.jsx';
import Signup from './pages/sign-up/SignupPage.jsx';
import Chat from './pages/homepage/ChatPage.jsx';
import NotFound from './pages/not-found/notFound.jsx';
import NavBar from './components/Navbar/Navbar.jsx';
import { initializeAuth } from './store/slices/authSlice.js';
import store from './store/store.js';
import { DependenciesProvider } from './contexts/DependenciesContext.jsx';

const isAuthenticated = () => Boolean(localStorage.getItem('token'));

const PrivateRoute = ({ element }) => (isAuthenticated() ? element : <Navigate to="/login" replace />);

const supportedPaths = ['/login', '/signup'];
const NavBarContainerWithVisibility = () => {
  const location = useLocation();
  return supportedPaths.includes(location.pathname)
    || location.pathname === '/' ? (
      <NavBar />
    ) : null;
};

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
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

const App = ({ dependencies }) => {
  const {
    rollbar,
    socket,
    i18n,
    leoProfanity,
  } = dependencies;

  return (
    <RollbarProvider config={rollbar}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <DependenciesProvider dependencies={dependencies}>
            <BrowserRouter>
              <MainLayout
                socket={socket}
                i18n={i18n}
                leoProfanity={leoProfanity}
              />
            </BrowserRouter>
          </DependenciesProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default App;
