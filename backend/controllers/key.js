import error from '../constants/error.js';
import * as model from '../models/key.js';
import * as verify from '../services/verify.js';

export const getKey = async (req, res, next) => {
    try {
        const { key } = req.query;
        if (!(await model.checkExists(key))) throw error.ERR_KEY_NOT_EXISTS;
        const result = await model.getKey(key);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const createKey = async (req, res, next) => {
    try {
        const key = verify.createKey();
        const result = await model.createKey('registerKey', key, undefined);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const deleteKey = async (req, res, next) => {
    try {
        const { key } = req.query;
        if (!(await model.checkExists(key))) throw error.ERR_KEY_NOT_EXISTS;
        const result = await model.deleteKey(key);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const checkExists = async (req, res, next) => {
    try {
        const { key } = req.query;
        if (!(await model.checkExists(key))) throw error.ERR_KEY_NOT_EXISTS;
        res.json({ status: true, data: true });
    } catch (e) {
        next(e);
    }
};