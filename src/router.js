
import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// router.post('/signin', requireSignin, UserController.signin);

router.post('/signup', UserController.signup);

export default router;
