import error from '../constants/error.js';
import * as fileService from '../services/file.js';
import * as model from '../models/file.js';
import * as pageModel from '../models/page.js'
import base64url from 'base64url';
import path from 'path';
import { statSync, unlinkSync } from 'fs';

const SUPPORTED_FILES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/x-m4a'];

export const uploadFile = async (req, res, next) => {
	try {
		const file = req.file;
		console.log(file.mimetype);
		if (!SUPPORTED_FILES.includes(file.mimetype)) throw error.ERR_FILE_NOT_SUPPORTED;
		const hash = fileService.hashFile(file.buffer);
        const b64FileName = base64url(file.originalname);
		if (!(await model.checkFileExists(hash))) {
            const extension = path.extname(file.originalname);
			const location = `${process.env.FILE_DIR}/${hash}${extension}`;
			await model.saveFile(hash, file.originalname, location, file.mimetype);
			fileService.saveFile(file.buffer, location);
		}
		return res.json({ status: true, data: `${hash}?n=${b64FileName}` });
	} catch (e) {
		next(e);
	}
};

export const deleteFile = async (req, res, next) => {
    try {
        const { file: hash } = req.query;
        const fileName = base64url.decode(req.query.n || '');
        let location = process.env.FILE_DIR + '/';
        if (!(await model.checkFileExists(hash))) throw error.ERR_FILE_NOT_EXISTS;
        if (fileName) location += hash + path.extname(fileName);
        else location = (await model.getFileData(hash)).fileLocation;
		if (statSync(location) === 'ENOENT') throw error.ERR_FILE_NOT_EXISTS;
        await model.deleteFile(hash);
        unlinkSync(location);
        res.json({ status: true, data: 'OK' });
    } catch (e) {
        next(e);
    }
};

export const getFile = async (req, res, next) => {
	try {
		const { file: hash } = req.params;
        const fileName = base64url.decode(req.query.n || '');
        let location = process.env.FILE_DIR + '/';
        if (!(await model.checkFileExists(hash))) throw error.ERR_FILE_NOT_EXISTS;
        if (fileName) location += hash + path.extname(fileName);
        else location = (await model.getFileData(hash)).fileLocation;
		if (statSync(location) === 'ENOENT') throw error.ERR_FILE_NOT_EXISTS;
		//const { fileLocation, fileType } = await model.getFileData(hash);
		//res.set({ 'Content-Type': fileType });
		res.download(location, fileName);
	} catch (e) {
		next(e);
	}
};

export const getFileData = async (req, res, next) => {
    try {
        const { file: hash } = req.query;
        if (!(await model.checkFileExists(hash))) throw error.ERR_FILE_NOT_EXISTS;
        const data = await model.getFileData(hash, true);
        res.json({ status: true, data });
    } catch (e) {
        next(e);
    }
};

export const getPageIncludesFile = async (req, res, next) => {
    try {
        const { file: hash } = req.query;
        if (!(await model.checkFileExists(hash))) throw error.ERR_FILE_NOT_EXISTS;
        const data = await pageModel.getPageIncludesFile(hash);
        res.json({ status: true, data });
    } catch (e) {
        next(e);
    }
};

export const getFileList = async (req, res, next) => {
	try {
		const { startId } = req.query;
        const fileList = await model.getFileList(startId, 25);
		res.json({ status: true, data: fileList });
	} catch (e) {
		next(e);
	}
};
