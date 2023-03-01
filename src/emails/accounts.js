const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

function sendWelcomeMail(email, name) {
  mg.messages.create("sandboxa5114d56ae56408bb60686a2e6da7fdf.mailgun.org", {
    from: "Mailgun Sandbox <postmaster@sandboxa5114d56ae56408bb60686a2e6da7fdf.mailgun.org>",
    to: [email],
    subject: "Thank's for joining in!",
    text: `Welcome to the app ${name}, let me know how you get along with the app.`,
  });
  // .catch((err) => console.log(err)); // logs any error`;
}

function sendGoodbyeMail(email, name) {
  mg.messages.create("sandboxa5114d56ae56408bb60686a2e6da7fdf.mailgun.org", {
    from: "Mailgun Sandbox <postmaster@sandboxa5114d56ae56408bb60686a2e6da7fdf.mailgun.org>",
    to: [email],
    subject: "Bye!",
    text: `Goodbye ${name}, we are going to miss you. Please let us know how we can better our services.`,
  });
  // .catch((err) => {
  //   console.log(err)
  // }); // logs any error`;
}

module.exports = {
  sendWelcomeMail,
  sendGoodbyeMail,
};
