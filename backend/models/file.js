import mongoose from './db.js';

const FileSchema = new mongoose.Schema({
	fileHash: {
		type: String,
		unique: true,
	},
    originalName: String,
	fileLocation: String,
	fileType: String,
});

const FileModel = mongoose.model('FileModel', FileSchema);

export const saveFile = (fileHash, originalName, fileLocation, fileType) => {
	const fileInstance = new FileModel({
		fileHash,
        originalName,
		fileLocation,
		fileType,
	});
	return fileInstance.save();
};

export const checkFileExists = async (fileHash) => {
    return (await FileModel.countDocuments({ fileHash }).exec() > 0);
}

export const getFileData = (fileHash, hideLocation=false) => {
    return FileModel.findOne({ fileHash }).select(hideLocation && '-fileLocation');
};

export const deleteFile = (fileHash) => {
    return FileModel.findOneAndDelete({ fileHash });
};

export const getFileList = (start_id, limit) => {
    const query = start_id ? { _id: { $lte: start_id } } : {};
    return FileModel.find(query).limit(limit).select('-fileLocation');
};