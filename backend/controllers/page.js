import error from '../constants/error.js';
import * as model from '../models/page.js';
import * as projectModel from '../models/project.js';
import DOMPurify from 'isomorphic-dompurify';

export const createPage = async (req, res, next) => {
    try {
        const { projectId, pageTitle: rawPageTitle, pageContent: rawPageContent, audioId } = req.body;
        if (!(await projectModel.checkExists(projectId))) error.ERR_PROJECT_NOT_EXISTS;
        const [pageTitle, pageContent] = [DOMPurify.sanitize(rawPageTitle), DOMPurify.sanitize(rawPageContent)];
        console.log(pageTitle, 'pageTitle');
        const result = await model.createPage(projectId, pageTitle, pageContent, audioId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const getPage = async (req, res, next) => {
    try {
        const { pageId } = req.query;
        if (!(await model.checkExists(pageId))) throw error.ERR_PAGE_NOT_EXISTS;
        const result = await model.getPage(pageId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const updatePage = async (req, res, next) => {
    try {
        const { pageId, pageTitle: rawPageTitle, pageContent: rawPageContent, audioId } = req.body;
        if (!(await model.checkExists(pageId))) throw error.ERR_PAGE_NOT_EXISTS;
        const [pageTitle, pageContent] = [DOMPurify.sanitize(rawPageTitle), DOMPurify.sanitize(rawPageContent)];
        const result = await model.updatePage(pageId, pageTitle, pageContent, audioId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const deletePage = async (req, res, next) => {
    try {
        const { pageId } = req.query;
        if (!(await model.checkExists(pageId))) throw error.ERR_PAGE_NOT_EXISTS;
        const result = await model.deletePage(pageId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const getPageList = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        if (!(await projectModel.checkExists(projectId))) throw error.ERR_PROJECT_NOT_EXISTS;
        const result = await model.getPageList(projectId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};