import mongoose from './db.js';
import autoIncrement from 'mongoose-auto-increment';

const pageSchema = new mongoose.Schema({
	pageId: {
		type: Number,
		unique: true,
	},
	projectId: {
		type: Number,
		required: true,
	},
	pageTitle: {
		type: String,
		required: true,
	},
	pageContent: {
		type: String,
	},
	audioId: {
		type: String,
	},
});

pageSchema.plugin(autoIncrement.plugin, {
	model: 'PageModel',
	field: 'pageId',
	startAt: 1,
	incrementBy: 1,
});

const PageModel = mongoose.model('PageModel', pageSchema);

export const createPage = (projectId, pageTitle, pageContent, audioId) => {
	const page = new PageModel({
		projectId,
		pageTitle,
		pageContent,
		audioId,
	});
	return page.save();
};

export const getPage = (pageId) => {
	return PageModel.findOne({ pageId });
};

export const getPageList = (projectId) => {
	return PageModel.find({ projectId });
};

export const updatePage = (pageId, pageTitle, pageContent, audioId) => {
	return PageModel.findOneAndUpdate({ pageId }, { pageTitle, pageContent, audioId }, { new: true });
};

export const deletePage = (pageId) => {
	return PageModel.deleteOne({ pageId });
};

export const getPageIncludesFile = (fileHash) => {
	return PageModel.find({
		$or: [{ audioId: { $regex: fileHash } }, { pageContent: { $regex: fileHash } }],
	});
};

export const checkExists = async (pageId) => {
	if (isNaN(pageId)) return false;
	return (await PageModel.countDocuments({ pageId })) > 0;
};
