import { useState } from "react";
import styles from "./authorization.module.scss";

interface UserData {
  email: string,
  password: string,
  login: string
};

function Authorization() {
  const [newUserData, setNewUserData] = useState<UserData>({
    email: "",
    password: "",
    login: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitted:", newUserData);
  }

  return (
    <div className={styles.authorization}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={`${styles.text} nunito-primary`}>You are new here, right?</h1>
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
        <button type="submit" className={`nunito-primary`}>Sure?</button>
      </form>
    </div>
  );
}

export default Authorization;
