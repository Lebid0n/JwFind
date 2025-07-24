import styles from "./profile-nav.module.scss";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";

function ProfileNav() {
  const { user, logout, loading } = useAuth();

  console.log("ProfileNav: Загрузка:", loading);
  console.log("ProfileNav: Текущий пользователь:", user);

  if (loading) return <div>Загрузка...</div>;

  return (
    <nav className={styles.nav}>
      <Link to="/" className={`${styles.link} nunito-primary`}>
        Главная
      </Link>
      <Link
        onClick={() => {
          console.log("ProfileNav: Клик по кнопке Выйти");
          logout();
        }}
        to="/"
        className={`${styles.logout} nunito-primary`}
      >
        Выйти
      </Link>
    </nav>
  );
}

export default ProfileNav;