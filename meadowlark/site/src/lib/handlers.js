import { getTodo } from './todos.js';
import * as fs from 'node:fs/promises';

const home = (req, res) => {
  res.cookie('signed_monster', 'ням-ням', { signed: true, httpOnly: true });
  req.session.userName = 'Anonymous';
  const colorScheme = req.session.colorScheme || 'dark';
  return res.render('home');
};
const about = (req, res) => {
  res.render('about', { todo: getTodo() });
};
const notFound = (req, res) => res.render('404');
const serverError = (err, req, res, next) => res.render('500');
const headers = (req, res) => {
  res.type('text/plain');
  const headers = Object.entries(req.headers).map(
    ([key, value]) => `${key}: ${value}`
  );
  res.send(headers.join('\n'));
};
const admin = (req, res) => res.render('admin', { layout: 'admin' }); // Используем другой layout

const helpersTest = (req, res) => res.render('helpers-test');
const newsletterSignup = (req, res) =>
  res.render('newsletter-signup', { csrf: 'Здесь находится токен CSRF' });
const newsletter = (req, res) =>
  res.render('newsletter', { csrf: 'Здесь находится токен CSRF' });

const newsletterSignupProcess = (req, res) => {
  console.log('Форма (из строки запроса): ' + req.query.form);
  console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
  console.log('Имя (из видимого поля формы): ' + req.body.name);
  console.log('E-mail (из видимого поля формы): ' + req.body.email);
  res.redirect(303, '/newsletter-signup/thank-you');
};
const newsletterSignupThankYou = (req, res) =>
  res.render('newsletter-signup-thank-you');

const vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth(),
  });
};

const vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('данные поля: ', fields);
  console.log('файлы: ', files);
  res.redirect(303, '/contest/vacation-photo-thank-you');
};

const vacationPhotoContestProcessThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you');
};

const api = {
  newsletterSignup: (req, res) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
    console.log('Имя (из видимого поля формы): ' + req.body.name);
    console.log('E-mail (из видимого поля формы): ' + req.body.email);
    const VALID_EMAIL_REGEX = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
        '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
        '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'
    );

    const name = req.body.name || '',
      email = req.body.email || '';

    console.log('res.locals', res.locals);
    // Проверка вводимых данных
    if (VALID_EMAIL_REGEX.test(email)) {
      /* req.session Поскольку уведомление перемещается из сеанса в res.locals.flash в промежуточном ПО,
       вам придется выполнять перенаправление, чтобы оно отобразилось 
       Если вы хотите отображать уведомление без перенаправления, устанавливайте значение res.locals.flash вместо req.session.flash. 
       ТОлько я не понял пока как это сделать
       
       */
      req.session.flash = {
        type: 'danger',
        intro: 'Ошибка проверки!',
        message: 'Введенный вами адрес электронной почты некорректен.',
      };
      return res.status(303).send({ result: 'error' });
    }
    req.session.flash = {
      type: 'success',
      intro: 'Спасибо!',
      message: 'Вы были подписаны на информационный бюллетень.',
    };

    res.send({ result: 'success' });
  },
  vacationPhotoContest: async (req, res, fields, files) => {
    console.log('field data: ', fields);
    console.log('files: ', files);
    console.log(req.path);
    res.send({ result: 'success' });
  },
  vacationPhotoContestError: (req, res, message) => {
    res.send({ result: 'error', error: message });
  },
};

const submit = (req, res) => {
  try {
    // Здесь мы попытаемся сохранить контакт в базе данных
    // или воспользуемся другим способом хранения...
    // На данный момент мы просто сымитируем ошибку.
    if (req.body.simulateError)
      throw new Error('ошибка при сохранении контакта!');
    console.log(`Получен контакт от ${req.body.name} <${req.body.email}>`);
    res.format({
      'text/html': () => res.redirect(303, '/about'),
      'application/json': () => res.json({ success: true }),
    });
  } catch (err) {
    // Здесь мы будем обрабатывать все ошибки при сохранении
    console.error(
      `Ошибка при обработке контакта от ${req.body.name} ` +
        `<${req.body.email}>`
    );
    res.format({
      'text/html': () => res.redirect(303, '/contact-error'),
      'application/json': () =>
        res.status(500).json({
          error: 'ошибка при сохранении информации о контакте',
        }),
    });
  }
};

export default {
  home,
  about,
  notFound,
  serverError,
  headers,
  submit,
  admin,
  helpersTest,
  newsletterSignup,
  newsletterSignupProcess,
  newsletterSignupThankYou,
  newsletter,
  vacationPhotoContest,
  vacationPhotoContestProcess,
  vacationPhotoContestProcessThankYou,
  api,
};
