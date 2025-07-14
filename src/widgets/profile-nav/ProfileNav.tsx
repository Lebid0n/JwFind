import styles from "./profile-nav.module.scss"

import { Link } from "react-router-dom";

function ProfileNav() {
  return(
    <nav className={styles.nav}>
      <Link to='/' className={`${styles.link} nunito-primary`}>
        home page
      </Link>
      <Link to='/profile/options'  className={`${styles.link} nunito-primary`}>
        options
      </Link>
    </nav>
  )
}

export default ProfileNav;