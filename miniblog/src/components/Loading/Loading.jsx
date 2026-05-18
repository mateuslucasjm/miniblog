import styles from "./Loading.module.css";

const Loading = ({ text = "Carregando...", fullScreen = false }) => {
  return (
    <div
      className={`${styles.loading} ${fullScreen ? styles.full_screen : ""}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className={styles.spinner} />
      <p>{text}</p>
    </div>
  );
};

export default Loading;
