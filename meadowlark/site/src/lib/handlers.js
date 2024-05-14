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

export default { home, about, notFound, serverError, headers, submit };
