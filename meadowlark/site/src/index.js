import * as url from 'url';
import process from 'process';
import chalk from 'chalk';
import 'dotenv/config';
import bodyParser from 'body-parser';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import fs from 'fs';
import morgan from 'morgan';

import path from 'path';
import formidable from 'formidable';

import express from 'express';
import { engine } from 'express-handlebars';

import handlers from '#@/lib/handlers.js';
import weatherMiddleware from '#@lib/middleware/weather.js';
import flashMiddleware from '#@lib/middleware/flash.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import dbConnect from '#@db.js';
await dbConnect();

const app = express();
const port = process.env.PORT || 3000;
console.log('process.env.PORT', process.env.PORT);
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

switch (process.env.NODE_ENV) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    let dir = path.resolve(__dirname, 'var');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const stream = fs.createWriteStream(path.resolve(dir, 'access.log'), {
      flags: 'a',
    });
    app.use(morgan('combined', { stream }));
    break;
}

// Настройка публичной папки
app.use(express.static(path.resolve(__dirname, './public')));
// Настройка парсера body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Настройка куки
app.use(cookieParser(process.env.COOKIE_SECRET || 'express'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'express',
  })
);

// Кастомные Middleware
app.use(weatherMiddleware);
app.use(flashMiddleware);

app.disable('x-powered-by');
// Доверяем прокси серваку
app.enable('trust proxy');

// Маршруты get
app.get('/', handlers.home);
app.get('/about', handlers.about);
app.get('/headers', handlers.headers);
app.get('/admin', handlers.admin);
app.get('/helpers-test', handlers.helpersTest);
app.get('/newsletter', handlers.newsletter);
app.get('/newsletter-signup', handlers.newsletterSignup);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);
app.get('/contest/vacation-photo', handlers.vacationPhotoContest);
app.get(
  '/contest/vacation-photo-thank-you',
  handlers.vacationPhotoContestProcessThankYou
);

// Маршруты post
app.post('/submit', handlers.submit);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);
app.post('/contest/vacation-photo/:year/:month', (req, res, next) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ error: err.message });
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  });
});
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err)
      return handlers.api.vacationPhotoContestError(req, res, err.message);
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

// Пользовательская страница 404
app.use(handlers.notFound);
// Пользовательская страница 500
app.use(handlers.serverError);

function startServer(port) {
  app.listen(port, () => {
    console.log(
      chalk.bgBlue(
        `Express запущен в режиме ` +
          `${app.get('env')} на http://localhost:${port}` +
          '; нажмите Ctrl+C для завершения.'
      )
    );
  });
}

// преобразовать наше приложение так, чтобы оно импортировалось как модуль
if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  startServer(port);
}
export default startServer;
