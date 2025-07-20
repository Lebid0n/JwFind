import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './vacation-list.module.scss';
import Header from '@/widgets/header/Header';

interface Vacation {
  id: number;
  title: string;
  description: string;
}

function VacationsList() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVacations() {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/home');
        setVacations(response.data);
        setFilteredVacancies(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при получении данных', error);
        setError('Не удалось загрузить вакансии. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchVacations();
  }, []);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = vacations.filter((vacation) =>
      vacation.title.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredVacancies(filtered);
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div className={styles.vacationList}>
        {isLoading ? (
          <p className={`${styles.loading} nunito-primary`}>Загрузка...</p>
        ) : error ? (
          <p className={`${styles.error} nunito-primary`}>{error}</p>
        ) : filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacation) => (
            <div key={vacation.id} className={styles.vacationCard}>
              <h2 className={`${styles.title} nunito-primary`}>{vacation.title}</h2>
              <p className={`${styles.description} nunito-primary`}>{vacation.description}</p>
            </div>
          ))
        ) : (
          <p className={`${styles.noResults} nunito-primary`}>Вакансии не найдены</p>
        )}
      </div>
    </div>
  );
}

export default VacationsList;