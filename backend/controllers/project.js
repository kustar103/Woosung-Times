import error from '../constants/error.js';
import * as model from '../models/project.js';
import DOMPurify from 'isomorphic-dompurify';

export const getProject = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        if (!(await model.checkExists(projectId))) throw error.ERR_PROJECT_NOT_EXISTS;
        const result = await model.getProject(projectId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const createProject = async (req, res, next) => {
    try {
        const { projectName: rawProjectName, projectDescription: rawProjectDescription } = req.body;
        const [projectName, projectDescription] = [DOMPurify.sanitize(rawProjectName), DOMPurify.sanitize(rawProjectDescription)];
        const result = await model.createProject(projectName, projectDescription);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const { projectId, projectName: rawProjectName, projectDescription: rawProjectDescription } = req.body;
        if (!(await model.checkExists(projectId))) throw error.ERR_PROJECT_NOT_EXISTS;
        const [projectName, projectDescription] = [DOMPurify.sanitize(rawProjectName), DOMPurify.sanitize(rawProjectDescription)];
        const result = await model.updateProject(projectId, projectName, projectDescription);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        if (!(await model.checkExists(projectId))) throw error.ERR_PROJECT_NOT_EXISTS;
        const result = await model.deleteProject(projectId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
}

export const getProjectList = async (req, res, next) => {
    try {
        const result = await model.getProjectList();
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};
