import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user_model';
import { populateUser } from '../controllers/user_controller';

dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
// not have separate ones
const localOptions = { usernameField: 'username' };

// options for jwt strategy
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

// username + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (username, password, done) => {
  try {
    const user = await populateUser(User.findOne({ username }), true /* include password */);
    if (!user) {
      done(`No account with username ${username}`, false);
      return;
    }
    user.comparePassword(password, (error, isMatch) => {
      if (error) {
        done(error, false);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  } catch (error) {
    done(error);
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  try {
    const user = await User.findById(payload.sub);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

// Tell passport to use this strategy
passport.use('jwt', jwtLogin);
passport.use('local', localLogin);

export const requireJwt = passport.authenticate('jwt', { session: false });
export const requireLocal = passport.authenticate('local', { session: false });
