import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './vacation-list.module.scss';
import Header from '../header/Header';

interface Vacation {
  id: number;
  name: string;
  description: string | null;
}

function VacationsList() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [filteredVacations, setFilteredVacations] = useState<Vacation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/home', {
          withCredentials: true,
          timeout: 5000,
        });
        console.log('Ответ сервера:', response.data);
        const vacations = response.data.vacations || response.data;
        if (Array.isArray(vacations)) {
          setVacations(vacations);
          setFilteredVacations(vacations);
        } else {
          throw new Error('Данные вакансий имеют неверный формат');
        }
      } catch (err: any) {
        console.error('Ошибка получения вакансий:', err);
        setError(err.response?.data?.error || err.message || 'Не удалось загрузить вакансии');
      } finally {
        setLoading(false);
      }
    };
    fetchVacations();
  }, []);

  // Функция для фильтрации вакансий по поисковому запросу
  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = vacations.filter(
      (vacation) =>
        vacation.name.toLowerCase().includes(lowerCaseQuery) ||
        (vacation.description && vacation.description.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredVacations(filtered);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <div>
        <ul className={styles.vacationList}>
          {filteredVacations.map((vacation) => (
            <li className={styles.vacationCard} key={vacation.id}>
              <h2>{vacation.name}</h2>
              {vacation.description && <p>{vacation.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default VacationsList;