import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <nav
      className={cn(
        'shadow-sm',
        'navbar',
        'navbar-expand-lg',
        'navbar-light',
        'bg-white'
      )}
    >
      <div className="container">
        <Link to="/login" className="navbar-brand text-decoration-none">
          {t('navbar.title')}
        </Link>
        {location.pathname === '/' && (
          <button
            onClick={handleLogOut}
            id="button"
            className="btn btn-primary"
            style={{ background: '#a594f9', borderColor: '#a594f9' }}
          >
            {t('navbar.logout')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
