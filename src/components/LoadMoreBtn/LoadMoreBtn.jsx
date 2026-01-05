import styles from "./LoadMoreBtn.module.css";

const LoadMoreBtn = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      Load more
    </button>
  );
};

export default LoadMoreBtn;
