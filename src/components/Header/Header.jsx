import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          <img
            src="/logo.svg"
            alt="abz agency logo"
            className={styles.logoImage}
          />
        </div>
        <nav className={styles.nav}>
          <a href="#users" className="button">
            Users
          </a>
          <a href="#registration" className="button">
            Sign up
          </a>
        </nav>
      </div>
    </header>
  );
}
