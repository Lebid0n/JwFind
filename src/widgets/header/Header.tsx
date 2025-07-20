import { useState } from 'react';
import { Link } from 'react-router-dom';
// styles
import '@/assets/font/mainFont.scss';
import styles from './header.module.scss';
// icons
import { FaRegUser } from 'react-icons/fa6';
import { IoLanguage } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { CiSearch } from 'react-icons/ci';

interface HeaderProps {
  onSearch: (query: string) => void; // Callback для передачи поискового запроса
}

function Header({ onSearch }: HeaderProps) {
  const [search, setSearch] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    onSearch(query); // Передаем запрос в родительский компонент
  };

  const clearSearch = () => {
    setSearch('');
    onSearch(''); // Сбрасываем фильтр
  };

  return (
    <header className={styles.header}>
      {/* globalLink */}
      <div className={styles.globalLinkContainer}>
        <Link className={styles.link} to="/">
          <h1 className="nunito-bald">JwFind</h1>
        </Link>
      </div>
      {/* searchBar */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Поиск вакансий..."
          value={search}
          onChange={handleSearch}
          className={`${styles.searchBar} nunito-bald`}
        />
        {search !== '' && (
          <button onClick={clearSearch} className={styles.clearButn}>
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
  );
}

export default Header;