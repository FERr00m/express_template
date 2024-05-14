import { getTodo } from './todos.js';

const home = (req, res) => res.render('home');
const about = (req, res) => {
  res.render('about', { todo: getTodo() });
};
const notFound = (req, res) => res.render('404');
const serverError = (err, req, res, next) => res.render('500');

export default { home, about, notFound, serverError };
