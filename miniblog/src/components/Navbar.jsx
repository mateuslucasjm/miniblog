import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../context/AuthContext";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const { logout } = useAuthentication();
  const { user } = useAuthValue();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? styles.active : "";

  return (
    <nav className={styles.navbar}>
      {menuOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}

      <div className={styles.header}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          Mini <span>Blog</span>
        </NavLink>

        <button
          type="button"
          className={`${styles.menu_btn} ${menuOpen ? styles.menu_btn_open : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span className={styles.hamburger} />
        </button>

        <ul className={`${styles.links_list} ${menuOpen ? styles.open : ""}`}>
          <li>
            <NavLink to="/" className={linkClass} onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          {!user && (
            <>
              <li>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  Entrar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Cadastrar
                </NavLink>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <NavLink
                  to="/posts/create"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Novo post
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="/about" className={linkClass} onClick={closeMenu}>
              Sobre
            </NavLink>
          </li>
          {user && (
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Sair
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
