import mongoose from './db.js';

const userSchema = new mongoose.Schema({
	userId: {
		type: String,
		unique: true,
	},
	userName: String,
	userEmail: {
		type: String,
		unique: true,
	},
	userPw: String,
    subscription: {
        type: Object,
        default: {}
    }
});

const UserModel = mongoose.model('UserModel', userSchema);

export const addUserData = (userId, userName, userEmail, userPw) => {
	const userInstance = new UserModel({
		userId,
		userName,
		userEmail,
		userPw,
        subscription: ''
	});
	return userInstance.save();
};

export const getUserData = (userId, userEmail) => {
	return UserModel.findOne({ [userId ? 'userId' : 'userEmail']: userId ? userId : userEmail });
};

export const removeUserData = (userId) => {
	return UserModel.findOneAndDelete({ userId });
};

export const changeUserData = (userId, userName, userEmail, userPw) => {
	return UserModel.findOneAndUpdate({ userId }, { userName, userEmail, userPw });
};

export const updatePw = (userEmail, userPw) => {
	return UserModel.findOneAndUpdate({ userEmail }, { userPw });
};


export const checkExists = async (userId, userEmail) => {
	const userIdCount = (await UserModel.countDocuments({ userId }).exec()) > 0;
	const userEmailCount = (await UserModel.countDocuments({ userEmail }).exec()) > 0;
	return { userIdCount, userEmailCount };
};

export const subscribePush = (userId, subscription) => {
    return UserModel.findOneAndUpdate({ userId }, { subscription });
};