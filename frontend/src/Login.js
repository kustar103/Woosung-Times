import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { refreshToken } from './services/silent-refresh';

function Login({ serviceStore }) {
	const [formData, setFormData] = useState({});
    const history = useHistory();
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onClick = async () => {
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/login`, formData, {
            withCredentials: true
        });
		if (!response.data.status) {
			alert('로그인에 실패하였습니다.');
			return;
		}
		const expires = new Date(response.data.data.expires) - new Date();
		const token = response.data.data.token;
		axios.defaults.headers.common['Authorization'] = token;
		setTimeout(refreshToken, expires);
		serviceStore.setIsLogined(true);
		serviceStore.setUserId(formData.userId);
        localStorage.setItem('isLogined', true);
        localStorage.setItem('userId', formData.userId);
        history.push('/')
	};

    const onRecoverClick = async (e) => {
        e.preventDefault();
        if (!window.confirm('비밀번호 복구를 진행하시겠습니까?')) return alert('취소되었습니다.');
        const userEmail = prompt('이메일을 입력하십시오.');
        const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/request-recover`, {
            userEmail
        });
        if (!response.data.status) return;
        alert('이메일 복구 주소가 전송되었습니다. 링크는 7일 이내 유효합니다.');
    };

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>로그인</h2>
			<div className="box">
				<div className="field">
					<label className="label">ID</label>
					<div className="control">
						<input className="input" type="text" name="userId" onChange={onChange} placeholder="아이디" />
					</div>
				</div>

				<div className="field">
					<label className="label">PW</label>
					<div className="control">
						<input className="input" type="password" name="userPw" onChange={onChange} placeholder="비밀번호" />
					</div>
				</div>
                <div className="field">
                    <label className="label"><a href="/" onClick={onRecoverClick}>비밀번호 복구</a></label>
                </div>
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					로그인
				</button>
			</div>
		</div>
	);
}

export default inject('serviceStore')(observer(Login));