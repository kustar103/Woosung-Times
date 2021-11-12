import express from 'express';

import * as authMiddleware from '../middlewares/auth.js';
import * as pageController from '../controllers/page.js';

const router = express.Router();

router.get('/get', pageController.getPage);
router.post('/create', authMiddleware.verifyToken, pageController.createPage);
router.delete('/delete', authMiddleware.verifyToken, pageController.deletePage);
router.post('/update', authMiddleware.verifyToken, pageController.updatePage);
router.get('/get-list', pageController.getPageList);

export default router;