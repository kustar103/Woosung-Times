import express from 'express';

import userRouter from './users.js';
import fileRouter from './files.js';
import projectRouter from './projects.js';
import pageRouter from './pages.js';
import error from '../constants/error.js';

const router = express.Router();

router.use('/api/user', userRouter);
router.use('/api/file', fileRouter);
router.use('/api/project', projectRouter);
router.use('/api/page', pageRouter);

router.use((err, req, res, next) => {
	if (error[err.msg] !== undefined) {
		return res.status(err.status).json({ status: false, data: err.msg });
	}
	console.log(err);
	res.status(500).json({ status: false, data: error.INTERNAL_SERVER_ERROR.msg });
});

export default router;
