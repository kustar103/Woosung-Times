import * as model from '../models/user.js';
import * as authModel from '../models/auth.js';
import * as keyModel from '../models/key.js';
import * as verify from '../services/verify.js';
import error from '../constants/error.js';

import DOMPurify from 'isomorphic-dompurify';

export const signUp = async (req, res, next) => {
	try {
		const { userId, userName, userEmail, userPw, registerKey } = req.body;
        const cleanUserName = DOMPurify.sanitize(userName);
        const existsResult = await model.checkExists(userId, userEmail);
        const isKeyExists = await keyModel.checkExists(registerKey.toUpperCase());
		if (existsResult.userIdCount) throw error.ERR_EXISTING_USER_ID;
		if (existsResult.userEmailCount) throw error.ERR_EXISTING_EMAIL;
        if (!isKeyExists) throw error.ERR_KEY_NOT_EXISTS;
        const pwHash = verify.createPwHash(userPw);
        await keyModel.deleteKey(registerKey);
		await model.addUserData(userId, cleanUserName, userEmail, pwHash, undefined);
		res.json({ status: true, data: 'OK' });
	} catch (e) {
		next(e);
	}
};

export const checkExists = async (req, res, next) => {
	try {
		const { userId, userEmail } = req.body;
		const result = await model.checkExists(userId, userEmail);
        if (result.userIdCount) throw error.ERR_EXISTING_USER_ID;
		if (result.userEmailCount) throw error.ERR_EXISTING_EMAIL;
		res.json({ status: true, data: 'OK' });
	} catch (e) {
		next(e);
	}
};

export const login = async (req, res, next) => {
    try {
        const { userId, userPw } = req.body;
        if (!(await model.checkExists(userId, '')).userIdCount) throw error.ERR_ID_NOT_EXISTS;
        const userData = await model.getUserData(userId, null);
        const result = verify.verifyPw(userPw, userData.userPw);
        req.userId = userId;
        if (result) next();
        else throw error.ERR_PW_INCORRECT;
    } catch (e) {
        next(e);
    }
};

export const logout = async (req, res, next) => {
	try {
        const token = req.cookies['Authorization'].replace('Bearer ', '');
		res.cookie('Authorization', '');
        await authModel.removeToken(token);
		res.json({ status: true, data: null });
	} catch (e) {
		next(e);
	}
};

export const subscribePush = async (req, res, next) => {
    try {
        const subscription = req.body;
        const userId = req.userId;
        await model.subscribePush(userId, subscription);
        res.json({ status: true, data: 'SUBSCRIPTION_ACCEPTED' });
    } catch (e) {
        next(e);
    }
};

export const requestPwRecover = async (req, res, next) => {
    try {
        const { userEmail } = req.body;
        if (!(await model.checkExists(null, userEmail)).userEmailCount) throw error.ERR_EMAIL_NOT_EXISTS;
        const recoverKey = verify.createRecoverKey();
        await keyModel.createKey('recoverKey', recoverKey, userEmail);
        await verify.sendRecoverEmail(req.app.locals.transporter, userEmail, `${process.env.CLIENT_URL}/recover/${recoverKey}`);
        res.json({ status: true, data: 'OK' });
    } catch (e) {
        next(e);
    }
};

export const acceptPwRecover = async (req, res, next) => {
    try { 
        const { recoverKey, userPw } = req.body;
        if (!(await keyModel.checkExists(recoverKey))) throw error.ERR_KEY_NOT_EXISTS;
        const result = await keyModel.deleteKey(recoverKey);
        const pwHash = verify.createPwHash(userPw);
        await model.updatePw(result.keyDescription, pwHash);
        res.json({ status: true, data: 'OK' })
    } catch (e) {
        next(e);
    }
};