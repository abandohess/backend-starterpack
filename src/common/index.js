import jwt from 'jwt-simple';
import util from 'util';

import User from '../models/user_model';

export const objectToString = (object) => {
  // Prints all object fields and full arrays.
  return util.inspect(object, false, null, true /* enable colors */);
};

export const getUserIdFromToken = (token) => {
  const userId = jwt.decode(token, process.env.AUTH_SECRET).sub;

  if (!userId) {
    throw new Error(`Invalid token ${token}`);
  }

  return userId;
};

export const assertUserExists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with id '${userId}' does not exist.`);
  }
  return user;
};
