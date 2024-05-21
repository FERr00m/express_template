import * as url from 'url';
import process from 'process';
import 'dotenv/config';
import bodyParser from 'body-parser';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import path from 'path';

import express from 'express';
import { engine } from 'express-handlebars';

import handlers from '#@/lib/handlers.js';
import weatherMiddleware from '#@lib/middleware/weather.js';

const app = express();
const port = process.env.PORT || 3000;

// Настройка механизма представлений Handlebars.
app.engine(
  'hbs',
  engine({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, './views'));
// Явным образом активировать кэширование представлений
//app.set('view cache', true)

// Настройка публичной папки
app.use(express.static(path.resolve(__dirname, './public')));
// Настройка парсера body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Кастомные Middleware
app.use(weatherMiddleware);

app.disable('x-powered-by');

// Маршруты get
app.get('/', handlers.home);
app.get('/about', handlers.about);
app.get('/headers', handlers.headers);
app.get('/admin', handlers.admin);
app.get('/helpers-test', handlers.helpersTest);
app.get('/newsletter', handlers.newsletter);
app.get('/newsletter-signup', handlers.newsletterSignup);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);

// Маршруты post
app.post('/submit', handlers.submit);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

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
