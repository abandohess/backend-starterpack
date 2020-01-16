import dotenv from 'dotenv';

const mailgun = require('mailgun-js');

dotenv.config({ silent: true });

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: 'mg.TODO.com' });

export const sendVerificationEmail = (user, token) => {
  const { username, email } = user;

  // const email = 'abandohess@gmail.com';
  // const username = 'abandohess';

  const link = `http://TODO.com/verify/${token}`;

  const data = {
    from: 'Memur <donotreply@TODO.com>',
    to: email,
    subject: 'verify your memur account',
    text: `Your username is ${username}\n\nVisit this link to verify your email address:\n\n${link}`,
  };
  console.log('sending to', email);
  mg.messages().send(data, (error, body) => {
    console.log(body);
    if (error) {
      console.error('error sending verif email', error);
    }
  });
};

export const lol = 'lol';
