export default {
    ERR_AUDIO_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_AUDIO_NOT_EXISTS',
        korMsg: '음원이 존재하지 않습니다.'
    },
    ERR_USER_INCORRECT: {
        status: 401,
        msg: 'ERR_USER_INCORRECT',
        korMsg: '올바른 이용자가 아닙니다.'
    },
    ERR_EMAIL_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_EMAIL_NOT_EXISTS',
        korMsg: '존재하지 않는 이메일입니다.'
    },
    ERR_PROJECT_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_PROJECT_NOT_EXISTS',
        korMsg: '프로젝트가 존재하지 않습니다.'
    },
    ERR_KEY_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_KEY_NOT_EXISTS',
        korMsg: '키가 존재하지 않습니다.'
    },
    ERR_PAGE_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_PAGE_NOT_EXISTS',
        korMsg: '페이지가 존재하지 않습니다.'
    },
    ERR_TOKEN_INVALID: {
        status: 401,
        msg: 'ERR_TOKEN_INVALID',
        korMsg: '유효하지 않은 토큰입니다.'
    },
    ERR_EXISTING_USER_ID: {
        status: 200,
        msg: 'ERR_EXISTING_USER_ID',
        korMsg: '이미 존재하는 ID입니다.'
    },
    ERR_EXISTING_EMAIL: {
        status: 200,
        msg: 'ERR_EXISTING_EMAIL',
        korMsg: '이미 존재하는 이메일입니다.'
    },
    ERR_ID_NOT_EXISTS: {
        status: 200,
        msg: 'ERR_ID_NOT_EXISTS',
        korMsg: '존재하는 ID가 아닙니다.'
    },
    ERR_PW_INCORRECT: {
        status: 200,
        msg: 'ERR_PW_INCORRECT',
        korMsg: '비밀번호가 올바르지 않습니다.'
    },
    ERR_FILE_NOT_SUPPORTED: {
        status: 406,
        msg: 'ERR_FILE_NOT_SUPPORTED',
        korMsg: '지원되는 파일이 아닙니다.'
    },
    ERR_FILE_NOT_EXISTS: {
        status: 404,
        msg: 'ERR_FILE_NOT_EXISTS',
        korMsg: '파일이 존재하지 않습니다.'
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        msg: 'INTERNAL_SERVER_ERROR',
        korMsg: '서버에 오류가 발생하였습니다.'
    }
};