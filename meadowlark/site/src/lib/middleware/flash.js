export default (req, res, next) => {
  // Если имеется уведомление,
  // переместим его в контекст, а затем удалим.
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
  }
  next();
};
