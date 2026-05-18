import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            Mini <span>Blog</span>
          </Link>
          <p>Compartilhe ideias, histórias e conhecimento com a comunidade.</p>
        </div>

        <nav className={styles.links} aria-label="Links do rodapé">
          <h4>Navegação</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">Sobre</Link>
            </li>
            <li>
              <Link to="/posts/create">Criar post</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.cta}>
          <h4>Comece agora</h4>
          <p>Escreva sobre o que você tem interesse!</p>
          <Link to="/posts/create" className="btn">
            Publicar
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          &copy; {year} Mini Blog. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
