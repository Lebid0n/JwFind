const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

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
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG and PNG images are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123123123",
  database: process.env.DB_NAME || "JwFind",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkDbConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log("Подключение к MySQL успешно");
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.warn("Таблица users не существует. Пожалуйста, создайте таблицу с правильной структурой.");
    } else {
      console.log("Таблица users найдена");
      const [columns] = await connection.query("DESCRIBE users");
      console.log("Структура таблицы users:", columns);
    }
    connection.release();
  } catch (err) {
    console.error("Ошибка подключения к MySQL:", err.message);
    process.exit(1);
  }
}
checkDbConnection();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      return res.status(401).json({ error: "Токен истек" });
    }
    req.user = decoded;
    console.log("Authenticated user:", decoded);
    next();
  } catch (err) {
    console.error("Ошибка проверки токена:", err.message);
    res.status(401).json({ error: "Недействительный токен" });
  }
};

app.post("/api/description", authenticate, upload.single("avatar"), async (req, res) => {
  const { description } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.user.userId;

  if (description && typeof description !== "string") {
    return res.status(400).json({ error: "Description must be a string" });
  }
  if (description && description.length > 1500) {
    return res.status(400).json({ error: "Description too long (max 1500 characters)" });
  }

  try {
    const updates = {};
    const params = [];

    if (description !== undefined && description !== null) {
      updates.description = description;
      params.push(description);
    }
    if (avatar) {
      updates.avatar = avatar;
      params.push(avatar);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const setClause = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    params.push(userId);

    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    await dbPool.execute(query, params);
    console.log("Updated user data for userId:", userId, { description, avatar });

    // Fetch updated user data to generate new JWT
    const [rows] = await dbPool.execute(
      "SELECT id AS userId, email, login, isEmployer, avatar, description FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      console.log("No user found for userId:", userId);
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const userInfo = {
      userId: rows[0].userId,
      email: rows[0].email,
      login: rows[0].login,
      isEmployer: rows[0].isEmployer,
      avatar: rows[0].avatar || null,
      description: rows[0].description || null,
    };

    // Generate new JWT with updated data
    const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ description: description || null, avatar: avatar || null });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/user-info", authenticate, async (req, res) => {
  try {
    console.log("JWT userId:", req.user.userId);
    const [rows] = await dbPool.execute(
      "SELECT id AS userId, email, login, isEmployer, avatar, description FROM users WHERE id = ?",
      [req.user.userId]
    );
    if (rows.length === 0) {
      console.log("No user found for userId:", req.user.userId);
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const userInfo = {
      userId: rows[0].userId,
      email: rows[0].email,
      login: rows[0].login,
      isEmployer: rows[0].isEmployer,
      avatar: rows[0].avatar || null,
      description: rows[0].description || null,
    };
    console.log("Данные пользователя из БД:", userInfo);
    res.status(200).json({ user: userInfo });
  } catch (err) {
    console.error("Ошибка при получении данных пользователя:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password, login, isEmployer } = req.body;

  console.log("Полученные данные для регистрации:", req.body);

  if (!email || !password || !login) {
    return res.status(400).json({ error: "Все поля обязательны!" });
  }

  try {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Неверный формат email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Пароль должен быть не короче 6 символов" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Пароль хеширован успешно");

    const sql =
      "INSERT INTO users (email, password, login, isEmployer) VALUES (?, ?, ?, ?)";
    const [result] = await dbPool.execute(sql, [email, hashedPassword, login, isEmployer || 0]);

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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

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
      {
        userId: user.id,
        email: user.email,
        login: user.login,
        isEmployer: user.isEmployer,
        avatar: user.avatar || null,
        description: user.description || null,
      },
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
      user: {
        id: user.id,
        email: user.email,
        login: user.login,
        isEmployer: user.isEmployer,
        avatar: user.avatar || null,
        description: user.description || null,
      },
    });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).json({ error: `Ошибка базы данных: ${err.message}` });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Выход выполнен" });
});

app.get("/api/home", async (req, res) => {
  try {
    const [rows] = await dbPool.execute("SELECT * FROM vacations");
    res.status(200).json({ vacations: rows });
  } catch (err) {
    console.error("Ошибка при получении вакансий:", err);
    res.status(500).json({ error: "Ошибка сервера при получении вакансий" });
  }
});

app.get("/api/description", authenticate, async (req, res) => {
  try {
    const [rows] = await dbPool.execute("SELECT description FROM users WHERE id = ?", [req.user.userId]);
    if (rows.length === 0) {
      console.log("No user found for userId:", req.user.userId);
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.status(200).json({ description: rows[0].description || null });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/vacation-manager", authenticate, async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  // Проверка входных данных
  if (!name || !description) {
    console.log("Missing required fields:", { name, description });
    return res.status(400).json({ error: "Название и описание вакансии обязательны" });
  }
  if (typeof name !== "string" || typeof description !== "string") {
    console.log("Invalid data types:", { name, description });
    return res.status(400).json({ error: "Название и описание должны быть строками" });
  }
  if (name.length > 255) {
    console.log("Name too long:", name.length);
    return res.status(400).json({ error: "Название вакансии слишком длинное (максимум 255 символов)" });
  }
  if (description.length > 1500) {
    console.log("Description too long:", description.length);
    return res.status(400).json({ error: "Описание вакансии слишком длинное (максимум 1500 символов)" });
  }
  if (req.user.isEmployer !== 1) {
    console.log("Unauthorized attempt to create vacancy by user:", userId);
    return res.status(403).json({ error: "Только работодатели могут создавать вакансии" });
  }

  try {
    const query = "INSERT INTO vacations (userId, name, description) VALUES (?, ?, ?)";
    const [result] = await dbPool.execute(query, [userId, name, description]);

    res.status(201).json({
      message: "Вакансия успешно создана",
      vacancy: {
        id: result.insertId,
        userId,
        name,
        description,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Database error in /api/vacation-manager:", err.message);
    if (err.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ error: "Таблица vacations не существует" });
    }
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Вакансия с таким названием уже существует" });
    }
    res.status(500).json({ error: `Ошибка базы данных: ${err.message}` });
  }
});

app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
