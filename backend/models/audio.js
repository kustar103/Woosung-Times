import mongoose from './db.js';

const audioSchema = new mongoose.Schema({
	category: mongoose.SchemaTypes.ObjectId,
	seq: Number,
	title: String,
	detail: String,
	html: String,
	fileHash: String,
});

const categorySchema = new mongoose.Schema({
	categoryName: String,
	detail: String,
});

const AudioModel = mongoose.model('AudioModel', audioSchema);

const CategoryModel = mongoose.model('CategoryModel', categorySchema);

export const addAudio = (category, seq, title, detail, html, fileHash) => {
	const audioInstance = new AudioModel({
		category,
		seq,
		title,
		detail,
		html,
		fileHash,
	});
	return audioInstance.save();
};

export const addCategory = (categoryName, detail) => {
	const categoryInstance = new CategoryModel({
		categoryName,
		detail,
	});
	return categoryInstance.save();
};

export const getCategoryList = () => {
	return CategoryModel.find({});
};

export const getAudioList = (category) => {
	return AudioModel.find({ category });
};

export const getAudio = (audioId) => {
	return AudioModel.findOne({ _id: audioId });
};

export const modifyAudio = (audioId, category, seq, title, detail, html, fileHash) => {
	return AudioModel.findOneAndUpdate({ _id: audioId }, { category, seq, title, detail, html, fileHash });
};

export const deleteAudio = (audioId) => {
	return AudioModel.findOneAndDelete({ _id: audioId });
};

export const checkAudioExists = async (audioId) => {
	return (await AudioModel.countDocuments({ _id: audioId })) > 0;
};
