import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./vacation-list.module.scss"

interface Vacation {
  id: number;
  title: string;
  description: string;
}

function VacationsList() {
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    async function fetchVacations() {
      try {
        const response = await axios.get('http://localhost:3000/api/home');
        setVacations(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных", error);
      }
    }

    fetchVacations();
  }, []);

  return (
    <div className={styles.vacationList}>
      <div className={styles.vacationCard}>
        <h2 className={`${styles.title} nunito-primary`}>Test vacation</h2>
        <p className={`${styles.description} nunito-primary`}>
          Company have vocations for some niggers to cutton fields. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Ea recusandae omnis aliquid amet voluptatibus libero ipsa aspernatur inventore explicabo facilis molestiae perspiciatis,
          illo quod ipsam harum quos, laudantium adipisci eius?
          Optio neque asperiores voluptates nihil voluptatum eaque ducimus eius quisquam quas officia similique,
          voluptatem rerum consectetur ea obcaecati cum amet quis veritatis rem ad fugiat autem. Consequatur amet quaerat dignissimos.
        </p>
      </div>
      <div className={styles.vacationCard}>
        <h2 className={`${styles.title} nunito-primary`}>Test vacation</h2>
        <p className={`${styles.description} nunito-primary`}>
          Company have vocations for some niggers to cutton fields. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Ea recusandae omnis aliquid amet voluptatibus libero ipsa aspernatur inventore explicabo facilis molestiae perspiciatis,
          illo quod ipsam harum quos, laudantium adipisci eius?
          Optio neque asperiores voluptates nihil voluptatum eaque ducimus eius quisquam quas officia similique,
          voluptatem rerum consectetur ea obcaecati cum amet quis veritatis rem ad fugiat autem. Consequatur amet quaerat dignissimos.
        </p>
      </div>
      <div className={styles.vacationCard}>
        <h2 className={`${styles.title} nunito-primary`}>Test vacation</h2>
        <p className={`${styles.description} nunito-primary`}>
          Company have vocations for some niggers to cutton fields. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Ea recusandae omnis aliquid amet voluptatibus libero ipsa aspernatur inventore explicabo facilis molestiae perspiciatis,
          illo quod ipsam harum quos, laudantium adipisci eius?
          Optio neque asperiores voluptates nihil voluptatum eaque ducimus eius quisquam quas officia similique,
          voluptatem rerum consectetur ea obcaecati cum amet quis veritatis rem ad fugiat autem. Consequatur amet quaerat dignissimos.
        </p>
      </div>
      {vacations.map((vacation) => (
        <div key={vacation.id} className={styles.vacationCard}>
          <h2 className={styles.title}>{vacation.title}</h2>
          <p className={styles.description}>{vacation.description}</p>
        </div>
      ))}
    </div>
  );
}

export default VacationsList;
