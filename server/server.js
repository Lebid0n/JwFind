const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Мидлвары
app.use(cors()); // Разрешает кросс-доменные запросы
app.use(express.json()); // Парсит JSON из тела запроса

// Настройка подключения к базе данных
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123123123',
  database: 'jwfind',
});

// Подключение к MySQL
db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
    process.exit(1);
  } else {
    console.log('Успешно подключено к MySQL');
  }
});

// Эндпоинт регистрации пользователя
app.post('/api/register', (req, res) => {
  const { email, password, login } = req.body;

  if (!email || !password || !login) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const sql = 'INSERT INTO users (email, password, login) VALUES (?, ?, ?)';

  db.query(sql, [email, password, login], (err, result) => {
    if (err) {
      console.error('Ошибка при добавлении пользователя:', err);
      return res.status(500).json({ error: 'Ошибка базы данных' });
    }

    return res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: result.insertId,
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
