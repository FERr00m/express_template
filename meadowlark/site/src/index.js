import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import path from 'path';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const port = process.env.PORT || 3000;

// Переменные
const todos = [
  'Победи свои страхи, или они победят тебя.',
  'Рекам нужны истоки.',
  'Не бойся неведомого.',
  'Тебя ждет приятный сюрприз.',
  'Будь проще везде, где только можно.',
];

// Настройка механизма представлений Handlebars.
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Настройка публичной папки
app.use(express.static(path.resolve(__dirname, './public')));

// Маршруты
app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => {
  const randomTodo = todos[Math.floor(Math.random() * todos.length)];
  res.render('about', { todo: randomTodo });
});

// Пользовательская страница 404
app.use((req, res) => {
  res.status(404);
  res.render('404');
});
// Пользовательская страница 500
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render('500');
});

app.listen(port, () => {
  console.log(
    `Express запущен на http://localhost:${port}; ` +
      `нажмите Ctrl+C для завершения.`
  );
});
