import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './profile.module.scss';
import { FaRegUser } from 'react-icons/fa6';

interface JwtPayload {
  userId: number;
  email: string;
  login: string;
  isEmployer: number;
  avatar: string | null;
  description: string | null;
}

function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ description: string; avatar: File | null }>({
    description: '',
    avatar: null,
  });
  const [newVacationData, setNewVacationData] = useState<{name: string; description: string}>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-info', {
          withCredentials: true,
          timeout: 5000,
        });
        console.log('User info response:', response.data); // Debug log
        setUserInfo(response.data.user);
        setFormData({ description: response.data.user.description || '', avatar: null });
      } catch (err: any) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || 'Не удалось загрузить профиль');
      }
    };

    fetchUserInfo();
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const updateDesc = async () => {
    try {
      const data = new FormData();
      data.append('description', formData.description);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      const response = await axios.post('http://localhost:3000/api/description', data, {
        withCredentials: true,
        timeout: 5000,
      });

      setUserInfo({
        ...userInfo!,
        description: response.data.description || formData.description,
        avatar: response.data.avatar || (formData.avatar ? URL.createObjectURL(formData.avatar) : userInfo!.avatar),
      });
      setIsEditMode(false);
    } catch (err: any) {
      console.error('Update error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Не удалось обновить профиль');
    }
  };

  const handleVacationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacationData.name.trim() || !newVacationData.description.trim()) {
      setError('Название и описание вакансии не могут быть пустыми');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/vacation-manager', // Use absolute URL
        newVacationData,
        { withCredentials: true, timeout: 5000 }
      );
      console.log('Vacancy created:', response.data);
      setNewVacationData({ name: '', description: '' });
      setError(null);
    } catch (err: any) {
      console.error('Vacancy creation error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Не удалось создать вакансию');
    }
  };

  if (error) return <div>Ошибка: {error}</div>;
  if (!userInfo) return <div>Загрузка...</div>;

  return (
    <div>
      {!isEditMode ? (
        <div className={styles.profileContainer}>
          <div className={styles.avatarAndName}>
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt={`${userInfo.login}'s avatar`} className={styles.avatar} />
            ) : (
              <FaRegUser className={styles.defaultAvatar} />
            )}
            <h1 className={`${styles.name} nunito-primary`}>{userInfo.login || userInfo.email}</h1>
          </div>
          <div className={styles.descriptionAndLinks}>
            <p className={`${styles.userRole} nunito-primary`}>
              Роль: {userInfo.isEmployer === 1 ? 'Работодатель' : 'Соискатель'}
            </p>
            <p className={`${styles.description} nunito-primary`}>
              {userInfo.description || 'No description yet'}
            </p>
          </div>
          <button onClick={() => setIsEditMode(true)} className={styles.editModeButn}>
            Редактировать описание
          </button>
          {userInfo.isEmployer === 1 ? (
            <div className={styles.vacationManager}>
              <form onSubmit={handleVacationSubmit} className={styles.vacationForm}>
                <input
                  type="text"
                  className={styles.vacationNameInput}
                  placeholder="Название вакансии"
                  value={newVacationData.name}
                  onChange={(e) => setNewVacationData({ ...newVacationData, name: e.target.value })}
                />
                <div>
                  <textarea
                    className={styles.vacationDescriptionInput}
                    placeholder="Описание вакансии"
                    value={newVacationData.description}
                    onChange={(e) => setNewVacationData({ ...newVacationData, description: e.target.value })}
                  />
                  <button type="submit" className={styles.createVacationButn}>
                    Создать вакансию
                  </button>
                </div>
              </form>
              {error && <div className={styles.errorMessage}>Ошибка: {error}</div>}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.profileContainer}>
          <div className={styles.avatarAndName}>
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt={`${userInfo.login}'s avatar`} className={styles.avatar} />
            ) : (
              <FaRegUser className={styles.defaultAvatar} />
            )}
            <input type="file" onChange={handleAvatarChange} accept="image/*" />
          </div>
          <div className={styles.descriptionAndLinks}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              className={`${styles.descriptionInput} nunito-primary`}
            />
            <button onClick={updateDesc} className={styles.saveDescButn}>
              Сохранить
            </button>
          </div>
          <button onClick={() => setIsEditMode(false)} className={styles.editModeButn}>
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;