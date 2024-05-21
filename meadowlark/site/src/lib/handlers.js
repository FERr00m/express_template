import { getTodo } from './todos.js';

const home = (req, res) => res.render('home');
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

const api = {
  newsletterSignup: (req, res) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
    console.log('Имя (из видимого поля формы): ' + req.body.name);
    console.log('E-mail (из видимого поля формы): ' + req.body.email);
    res.send({ result: 'success' });
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
  api,
};
