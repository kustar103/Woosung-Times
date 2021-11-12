import mongoose from './db.js';
import autoIncrement from 'mongoose-auto-increment';

const projectSchema = new mongoose.Schema({
    projectId: {
        type: Number,
        unique: true,
        required: true
    },
	projectName: {
		type: String
	},
	projectDescription: String,
});

projectSchema.plugin(autoIncrement.plugin, {
    model: 'ProjectModel',
    field: 'projectId',
    startAt: 1,
    incrementBy: 1
});

const ProjectModel = mongoose.model('ProjectModel', projectSchema);

export const createProject = (projectName, projectDescription) => {
	const projectInstance = new ProjectModel({
		projectName, projectDescription,
	});
	return projectInstance.save();
};

export const getProject = (projectId) => {
	return ProjectModel.findOne({ projectId });
};

export const updateProject = (projectId, projectName, projectDescription) => {
    return ProjectModel.findOneAndUpdate({ projectId }, { projectName, projectDescription }, { new: true });
};

export const deleteProject = (projectId) => {
    return ProjectModel.findOneAndRemove({ projectId });
};

export const getProjectList = () => {
    return ProjectModel.find({});
};

export const checkExists = async (projectId) => {
    if (isNaN(projectId)) return false;
    return (await ProjectModel.countDocuments({ projectId })) > 0;
};