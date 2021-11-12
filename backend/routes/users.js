import express from 'express';
import * as userController from '../controllers/user.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as keyController from '../controllers/key.js';

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/check-exists', userController.checkExists);
router.post('/login', userController.login, authMiddleware.issueToken);
router.post('/logout', userController.logout);
router.post('/silent-refresh', authMiddleware.issueAccessToken);
router.get('/create-key', authMiddleware.verifyToken, keyController.createKey);
router.post('/request-recover', userController.requestPwRecover);
router.post('/accept-recover', userController.acceptPwRecover);

export default router;