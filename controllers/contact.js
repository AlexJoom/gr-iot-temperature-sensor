const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact',
    menuItem:"contact"
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Παρακαλώ εισαγάγετε το ονοματεπώνυμό σας').notEmpty();
  req.assert('email', 'Η διεύθυνση email δεν είναι σωστή').isEmail();
  req.assert('message', 'Παρακαλω εισαγάγετε ενα μύνημα').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: process.env.CONTACT_EMAIL,
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'ETS | Contact request',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Το email σας εστάλη επιτυχώς!' });
    res.redirect('/contact');
  });
};
