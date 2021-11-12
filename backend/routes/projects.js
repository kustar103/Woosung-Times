import express from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as projectController from '../controllers/project.js';

const router = express.Router();

router.get('/get', projectController.getProject);
router.post('/create', authMiddleware.verifyToken, projectController.createProject);
router.delete('/delete', authMiddleware.verifyToken, projectController.deleteProject);
router.post('/update', authMiddleware.verifyToken, projectController.updateProject);
router.get('/get-list', projectController.getProjectList);

export default router;