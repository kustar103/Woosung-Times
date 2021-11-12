import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';

export const createToken = (key, payload, expire) => {
	const token = jwt.sign(payload, key, { expiresIn: expire });
	return token;
};

export const verifyToken = (key, token) => {
	try {
		return jwt.verify(token, key);
	} catch (e) {
		return 'TOKEN_INVALID';
	}
};

export const createPwHash = (pw) => {
	const salt = randomBytes(10).toString('hex');
	const hash = CryptoJS.SHA512(salt + pw);
	return salt + '$' + hash;
};

export const verifyPw = (pw, cipher) => {
	const salt = cipher.split('$')[0];
	const hash = cipher.split('$')[1];
	const checkHash = '' + CryptoJS.SHA512(salt + pw);
	return hash === checkHash;
};

export const createKey = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
};

export const createRecoverKey = () => {
	let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrs0123456789';
    const charLength = characters.length;
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
};

export const sendRecoverEmail = (transporter, target, url) => {
	return transporter.sendMail({
		from: `"WS Times" <${process.env.EMAIL_USER_SEND}>`,
		to: target,
		subject: '우성 타임즈 비밀번호 복구',
		text: `아래 링크를 클릭해 비밀번호 복구를 진행하시기 바랍니다.`,
		html: `아래 링크를 클릭해 비밀번호 복구를 진행하시기 바랍니다.<br/><a href="${url}">복구하기</a>`,
	});
};