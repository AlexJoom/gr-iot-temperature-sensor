/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Temperature demo',
    menuItem: "home"
  });
};
