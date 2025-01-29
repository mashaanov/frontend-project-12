import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "../Navbar/Navbar.module.scss";

const NavBar = () => {
  return (
    <header>
      <nav
        className={cn(
          "shadow-sm",
          "navbar",
          "navbar-expand-lg",
          "navbar-light",
          "bg-white",
          styles.navbar
        )}
      >
        <div className="container">
          <Link to="/login" className="navbar-brand text-decoration-none">
            Hexlet Chat
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
