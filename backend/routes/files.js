import express from 'express';
import multer from 'multer';

import * as authMiddleware from '../middlewares/auth.js';
import * as fileController from '../controllers/file.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
    storage, 
    limits: { 
        fileSize: 52428800
    } 
});

router.post('/upload', authMiddleware.verifyToken, upload.single('file'), fileController.uploadFile);
router.delete('/delete', authMiddleware.verifyToken, fileController.deleteFile);
router.get('/get/:file', fileController.getFile);
router.get('/get-data', authMiddleware.verifyToken, fileController.getFileData);
router.get('/page-include', authMiddleware.verifyToken, fileController.getPageIncludesFile);
router.get('/get-list', authMiddleware.verifyToken, fileController.getFileList);



export default router;
