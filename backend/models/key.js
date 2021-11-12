import mongoose from './db.js';
import autoIncrement from 'mongoose-auto-increment';

const keySchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true
    },
	keyName: {
		type: String
	},
    createdAt: {
        type: Date,
        expires: '7d',
        default: Date.now
    },
	keyDescription: {
        type: String
    }
});


const KeyModel = mongoose.model('KeyModel', keySchema);

export const createKey = (keyName, key, keyDescription) => {
	const projectInstance = new KeyModel({
		keyName, key, keyDescription
	});
	return projectInstance.save();
};

export const getKey = (key) => {
	return KeyModel.findOne({ key });
};

export const updateKey = (key, keyName, keyDescription) => {
    return KeyModel.findOneAndUpdate({ key }, { keyName, keyDescription }, { new: true });
};

export const deleteKey = (key) => {
    return KeyModel.findOneAndRemove({ key });
};

export const getKeyList = () => {
    return KeyModel.find({});
};

export const checkExists = async (key) => {
    return (await KeyModel.countDocuments({ key })) > 0;
};