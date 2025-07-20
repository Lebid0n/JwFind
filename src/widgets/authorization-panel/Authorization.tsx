import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Добавляем useNavigate для редиректа
import axios from "axios";
import styles from "./authorization.module.scss";

interface NewUserData {
  email: string;
  password: string;
  login: string;
  isEmployer: boolean;
}

interface UserLoginData {
  email: string;
  password: string;
}

function Authorization() {
  const [regLogPanel, setRegLogPanel] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [newUserData, setNewUserData] = useState<NewUserData>({
    email: "",
    password: "",
    login: "",
    isEmployer: false,
  });

  const [loginData, setLoginData] = useState<UserLoginData>({
    email: "",
    password: "",
  });

  async function handleRegistration(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        newUserData,
        { withCredentials: true }
      );
      console.log("Registration successful:", response.data);
      setRegLogPanel(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Ошибка регистрации";
      setError(errorMessage);
      console.error("Registration failed:", error);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        loginData,
        { withCredentials: true }
      );
      console.log("Login successful:", response.data);
      navigate("/profile");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Ошибка входа";
      setError(errorMessage);
      console.error("Login failed:", error);
    }
  }

  return (
    <>
      {regLogPanel ? (
        <div className={styles.authorization}>
          <form onSubmit={handleRegistration} className={styles.form}>
            <h1 className={`${styles.text} nunito-primary`}>You are new here, right?</h1>
            {error && <p className={`${styles.error} nunito-primary`}>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              required
              className={`${styles.input} nunito-primary`}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              required
              className={`${styles.input} nunito-primary`}
            />
            <input
              type="text"
              placeholder="Login"
              value={newUserData.login}
              onChange={(e) =>
                setNewUserData({ ...newUserData, login: e.target.value })
              }
              required
              className={`${styles.input} nunito-primary`}
            />
            <label className={`${styles.label} nunito-primary`}>Are you an employer?</label>
            <input
              type="checkbox"
              checked={newUserData.isEmployer}
              onChange={(e) =>
                setNewUserData({ ...newUserData, isEmployer: e.target.checked })
              }
              className={`${styles.checkbox} nunito-primary`}
            />
            <button type="submit" className={`nunito-primary`}>
              Create
            </button>
          </form>
          <div className={styles.options}>
            <Link to="/" className={styles.back}>
              Back
            </Link>
            <button
              onClick={() => setRegLogPanel(false)}
              className={styles.changeModeButn}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.authorization}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h1 className={`${styles.text} nunito-primary`}>How it's going on?</h1>
            {error && <p className={`${styles.error} nunito-primary`}>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
              className={`${styles.input} nunito-primary`}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              className={`${styles.input} nunito-primary`}
            />
            <button type="submit" className={`nunito-primary`}>
              Welcome
            </button>
          </form>
          <div className={styles.options}>
            <Link to="/" className={styles.back}>
              Back
            </Link>
            <button
              onClick={() => setRegLogPanel(true)}
              className={styles.changeModeButn}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Authorization;