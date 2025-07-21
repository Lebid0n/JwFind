import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './employee-profile.module.scss'
import { FaRegUser } from 'react-icons/fa6';

interface JwtPayload {
  userId: number;
  email: string;
  login: string;
  isEmployer: number;
  avatar: string | null;
  description: string | null;
}

function EmployeeProfile() {
  const [userInfo, setUserUserInfo] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-info', {
          withCredentials: true,
          timeout: 5000,
        });
        console.log('Ответ сервера:', response.data);
        setUserUserInfo(response.data.user);
      } catch (err: any) {
        console.error('Ошибка получения данных пользователя:', err);
        setError(
          err.response?.data?.error ||
          err.message ||
          'Не удалось загрузить профиль'
        );
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!userInfo) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatarAndName}>
        { userInfo.avatar ? 
          <img
            src={userInfo.avatar}
            alt={`${userInfo.login} avatar` || 'User Avatar'}
            className={styles.avatar}
          />
          :
          <FaRegUser className={styles.defaultAvatar}/>
        }
        <h1 className={`${styles.name} nunito-primary`}>{userInfo.login || userInfo.email}</h1>
      </div>
      <div className={styles.descriptionAndLinks}>
        <p className={`${styles.userRole} nunito-primary`}>Роль: {userInfo.isEmployer ? 'Работодатель' : 'Соискатель'}</p>
        {userInfo.description && <p className={`${styles.description} nunito-primary`}>Описание: {userInfo.description}</p>}
      </div>
    </div>
  );
}

export default EmployeeProfile;