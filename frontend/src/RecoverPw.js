import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function RecoverPw({ serviceStore }) {
	const [formData, setFormData] = useState({
        userPw: '',
        userPwCheck: ''
    });
    const [isPwWrong, setPwWrong] = useState(false);
    const { recoverKey } = useParams();
    const history = useHistory();
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

    const onPwInput = () => {
		if (formData.userPwCheck && formData.userPw !== formData.userPwCheck) setPwWrong(true);
		else setPwWrong(false);
	};

	const onClick = async () => {
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/accept-recover`, {
            recoverKey,
            userPw: formData.userPw
        });
		if (!response.data.status) return;
        alert('비밀번호 재설정이 완료되었습니다.');
        history.push('/');
	};


	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>비밀번호 재설정</h2>
			<div className="box">
				<div className="field">
					<label className="label">PW</label>
					<div className="control">
						<input className="input" type="password" name="userPw" onChange={onChange} placeholder="비밀번호" />
					</div>
				</div>

				<div className="field">
					<label className="label">PW 확인</label>
					<div className="control">
						<input className="input" type="password" name="userPwCheck" onChange={onChange} onKeyUp={onPwInput} placeholder="비밀번호 확인" />
					</div>
                    {isPwWrong ? (
						<label className="label" style={{ color: '#FF0000' }}>
							비밀번호가 일치하지 않습니다!
						</label>
					) : (
						''
					)}
				</div>
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					복구
				</button>
			</div>
		</div>
	);
}

export default inject('serviceStore')(observer(RecoverPw));