

exports.getDashboard = (req, res) => {

  var temperatureData =[];
  res.render('dashboard', {
    title: 'Dashboard',
    menuItem: "dashboard",
    measurements: temperatureData
  });
};
