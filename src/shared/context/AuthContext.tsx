import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type User = {
  userId: number;
  email: string;
  login: string;
  isEmployer: number;
  avatar: string | null;
  description: string | null;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  loading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("AuthContext: Проверяем авторизацию...");
        const response = await axios.get("http://localhost:3000/api/user-info", {
          withCredentials: true,
          timeout: 5000,
        });
        console.log("AuthContext: Ответ сервера:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("AuthContext: Ошибка проверки авторизации:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true); // Устанавливаем loading в true
      console.log("AuthContext: Выполняем вход...");
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { email, password },
        { withCredentials: true, timeout: 5000 }
      );
      console.log("AuthContext: Вход успешен, пользователь:", response.data.user);
      setUser(response.data.user);
      setLoading(false); // Снимаем loading после обновления user
      navigate("/");
    } catch (error) {
      console.error("AuthContext: Ошибка входа:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("AuthContext: Начало выхода...");
      const response = await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true, timeout: 5000 }
      );
      console.log("AuthContext: Запрос /api/logout выполнен, ответ:", response.data);
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict";
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; SameSite=Strict";
      console.log("AuthContext: Cookie jwt очищен");
      setUser(null);
      console.log("AuthContext: Пользователь очищен (user = null)");
      navigate("/");
    } catch (error) {
      console.error("AuthContext: Ошибка выхода:", error);
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict";
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; SameSite=Strict";
      setUser(null);
      console.log("AuthContext: Пользователь очищен (user = null) несмотря на ошибку");
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};