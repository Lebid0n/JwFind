// react
import { useState } from 'react';
import { Link } from 'react-router-dom';
// styles
import '@/assets/font/mainFont.scss'
import styles from './header.module.scss'
// icons
import { FaRegUser } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";

function Header() {
  const [search, setSearch] = useState<string>('')

  return(
    <header className={styles.header}>
      {/* globalLink */}
      <div className={styles.globalLinkContainer}>
        <Link className={styles.link} to="/">
          <h1 className='nunito-bald'>
            JwFind
          </h1>
        </Link>
      </div>
      {/* searchBar */}
      <div className={styles.searchBarContainer}>
        <input 
          type="text"
          placeholder="?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${styles.searchBar} nunito-bald`} 
        />
        {search !== "" && (
          <button onClick={() => setSearch('')} className={styles.clearButn}>
            <RxCross2 />
          </button>
        )}
        <button className={styles.searchButn}>
          <CiSearch />
        </button>
      </div>
      {/* optionButns */}
      <div className={styles.butnContainer}>
        <Link className={`${styles.translatorButn} nunito-primary`} to="/">
          <IoLanguage />
        </Link>
        <Link className={styles.profileButn} to="/authorization">
          <FaRegUser />
        </Link>
      </div>
    </header>
  )
}

export default Header;