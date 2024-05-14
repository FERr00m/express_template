import * as url from 'url';
import process from 'process';
import 'dotenv/config';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import path from 'path';

import express from 'express';
import { engine } from 'express-handlebars';

import handlers from './lib/handlers.js';

const app = express();
const port = process.env.PORT || 3000;

// Кастомные модули
import { getTodo } from './lib/todos.js';

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
app.get('/', handlers.home);

app.get('/about', handlers.about);

// Пользовательская страница 404
app.use(handlers.notFound);
// Пользовательская страница 500
app.use(handlers.serverError);

// преобразовать наше приложение так, чтобы оно импортировалось как модуль
if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(
      `Express запущен на http://localhost:${port}` +
        '; нажмите Ctrl+C для завершения.'
    );
  });
}
export default app;
