const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2/promise"); // Используем promise-версию mysql2
const cors = require("cors");
require("dotenv").config();

const app = express();

// Настройка CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Создание пула соединений с MySQL
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123123123",
  database: process.env.DB_NAME || "JwFind",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Проверка подключения к базе данных
async function checkDbConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log("Подключение к MySQL успешно");
    connection.release();
  } catch (err) {
    console.error("Ошибка подключения к MySQL:", err.message);
    process.exit(1);
  }
}
checkDbConnection();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middleware для проверки JWT
const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Ошибка проверки токена:", err.message);
    res.status(401).json({ error: "Недействительный токен" });
  }
};

// Регистрация
app.post("/api/register", async (req, res) => {
  const { email, password, login, isEmployer } = req.body;

  console.log("Полученные данные для регистрации:", req.body);

  if (!email || !password || !login) {
    return res.status(400).json({ error: "Все поля обязательны!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Пароль хеширован успешно");

    const sql =
      "INSERT INTO users (email, password, login, isEmployer) VALUES (?, ?, ?, ?)";
    const [result] = await dbPool.execute(sql, [email, hashedPassword, login, isEmployer || false]);

    console.log("Пользователь успешно зарегистрирован:", result);
    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email или login уже заняты" });
    }
    if (err.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ error: "Таблица users не существует" });
    }
    res.status(500).json({ error: `Ошибка базы данных: ${err.message}` });
  }
});

// Логин
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Полученные данные для логина:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Все поля обязательны!" });
  }

  try {
    const [rows] = await dbPool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isEmployer: user.isEmployer },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Авторизация успешна",
      user: { id: user.id, email: user.email, login: user.login, isEmployer: user.isEmployer },
    });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).json({ error: `Ошибка базы данных: ${err.message}` });
  }
});

// Логаут
app.post("/api/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Выход выполнен" });
});

// Пример защищенного маршрута
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log("Сервер запущен на порту 3000"));