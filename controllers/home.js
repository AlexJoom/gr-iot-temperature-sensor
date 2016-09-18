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

exports.about= (req, res) => {
  res.render('about', {
    title: 'Σχετικά',
    menuItem: "about"
  });
};
