import { Router } from 'express';

import * as UserController from './controllers/user_controller';
import signS3 from './services/s3';
import { requireLocal /* requireJwt */ } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// Authentication
router.route('/verify/:token')
  .get(UserController.verifyUser);

router.route('/users/:userid')
  .get(UserController.getUser); // TODO require jwt

router.route('/sign-s3') // TODO require jwt
  .get(signS3);

router.post('/signup', UserController.signup);

router.post('/signin', requireLocal, UserController.sendAuthToken);

export default router;
