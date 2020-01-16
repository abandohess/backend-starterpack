import jwt from 'jwt-simple';
import User from '../models/user_model';
import { sendVerificationEmail } from '../services/mailgun';
import { assertUserExists, getUserIdFromToken } from '../common';

// encodes a new token for a user given userType and userID
const getToken = (userId) => {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: userId,
    iat: timestamp,
  }, process.env.AUTH_SECRET);
};

export const signup = async (req, res) => {
  let { email, username } = req.body;
  const { password } = req.body;
  if (!email || !username || !password) {
    console.error('Missing params.');
    return res.status(500).json({ message: 'Missing params.' });
  }

  email = email.toLowerCase();
  username = username.toLowerCase();

  try {
    if (username.length > 30) {
      throw new Error(`username cannot be more than 30 chars. It has ${username.length} chars. Username: ${username}.`);
    }
    if (password.length > 30) {
      // Don't log password lol.
      throw new Error(`password cannot be more than 30 chars. It has ${password.length} chars.`);
    }
    if (email.length > 280) {
      throw new Error(`email cannot be more than 280 chars. It has ${email.length} chars. Email: ${email}`);
    }

    let existing = await User.findOne({ email });
    if (existing) {
      console.error(`Email ${email} already associated with another account.`);
      return res.status(500).json({ message: 'Email already exists.' });
    }

    existing = await User.findOne({ username });
    if (existing) {
      console.error(`Username ${username} already associated with another account.`);
      return res.status(500).json({ message: 'Username already exists.' });
    }

    const user = new User({ email, username, password });

    const token = getToken(user._id);

    sendVerificationEmail(user, token);

    return res.status(200).json({
      user,
      userId: user._id,
      token,
    });
  } catch (error) {
    console.log('Error in signup', error);
    return res.status(500).json({ error });
  }
};

// Called on sign in
export const sendAuthToken = (req, res) => {
  let { user } = req;
  user = user.toObject();

  delete user.password;

  res.send({
    user,
    token: getToken(user._id),
    userId: user._id,
  });
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;
  // Theoretically not possible b/c if there was no token in the request url,
  // then the request url wouldn't have matched the route for this function.
  if (!token) {
    console.error('Missing params.');
    return res.status(500).json({ message: 'Missing params.' });
  }

  try {
    const userId = getUserIdFromToken(token);

    const user = await User.findByIdAndUpdate(userId, { verified: true });

    // Idk how this would ever happen.
    if (!user) {
      console.error(`Could not find user with id: ${userId}`);
      // Don't send the decoded user id back to the frontend.
      return res.status(500).json({ message: 'Could not find user.' });
    }

    return res.status(200).json({ message: 'Verified email.' });
  } catch (error) {
    console.log('Error in verifyUser', error);
    return res.status(500).json({ error });
  }
};

export const getUser = async (req, res) => {
  const { userid } = req.params;
  const userId = userid;
  // Theoretically not possible b/c if there was no userId in the request url,
  // then the request url wouldn't have matched the route for this function.
  if (!userId) {
    console.error('Missing params.');
    return res.status(500).json({ message: 'Missing params.' });
  }

  try {
    // Do not send password.
    const user = await assertUserExists(userId);

    return res.status(200).json({ user });
  } catch (error) {
    console.log('Error in getUserData', error);
    return res.status(500).json({ error });
  }
};
