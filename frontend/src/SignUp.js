import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { error } from './constants/error';

function SignUp() {
	const [input, setInput] = useState({
        userId: '',
        userPw: '',
        userPwCheck: '',
        userName: '',
        userEmail: '',
        registerKey: ''
    });
	const [isPwWrong, setPwWrong] = useState(false);
	const history = useHistory();

	const onChange = (e) => {
		const { name, value } = e.target;
		setInput({
			...input,
			[name]: value,
		});
	};

	const onPwInput = () => {
		if (input.userPwCheck && input.userPw !== input.userPwCheck) setPwWrong(true);
		else setPwWrong(false);
	};

	const onSubmit = async () => {
        //if (!input.registerKey.trim()) alert('가입 코드를 입력해 주십시오.')
		let response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/check-exists`, {
			userId: input.userId,
			userEmail: input.userEmail,
            registerKey: input.registerKey
		});

		const exists = response.data.data;

		if (exists && error.hasOwnProperty(exists)) {
			alert(error[exists].msgKor);
		}

		response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/signup`, input);

		if (response.data.data === 'OK') {
            alert('회원가입이 완료되었습니다.');
            history.push('/');
        }
	};

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>
                관리자 등록
			</h2>
			<div className="box">
				<div className="field">
					<label className="label">ID</label>
					<div className="control">
						<input className="input" type="text" placeholder="아이디" name="userId" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">PW</label>
					<div className="control">
						<input className="input" type="password" placeholder="비밀번호" name="userPw" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">PW 확인</label>
					<div className="control">
						<input className="input" type="password" placeholder="비밀번호 확인" name="userPwCheck" onChange={onChange} onKeyUp={onPwInput} />
					</div>
					{isPwWrong ? (
						<label className="label" style={{ color: '#FF0000' }}>
							비밀번호가 일치하지 않습니다!
						</label>
					) : (
						''
					)}
				</div>
				<div className="field">
					<label className="label">닉네임</label>
					<div className="control">
						<input className="input" type="text" placeholder="닉네임" name="userName" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">이메일 주소</label>
					<div className="control">
						<input className="input" type="email" placeholder="to@example.com" name="userEmail" onChange={onChange} />
					</div>
				</div>
                <div className="field">
					<label className="label">가입 코드</label>
					<div className="control">
                    <input className="input" type="text" placeholder="가입 코드" name="registerKey" onChange={onChange} />
					</div>
				</div>
				<button className="button is-fullwidth is-primary" onClick={onSubmit}>
					회원가입
				</button>
			</div>
		</div>
	);
}

export default SignUp;