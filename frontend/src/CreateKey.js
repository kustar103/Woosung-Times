import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';

function CreateKey({ serviceStore }) {
    const [registerKey, setRegisterKey] = useState('');

    const onClick = async () => {
        const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}/api/user/create-key`);
        if (!response.data.status) return;
        setRegisterKey(response.data.data.key);
    };

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>가입 코드 생성</h2>
			<div className="box">
                <div>
                    *가입 코드는 관리자 가입을 위해 필요한 코드입니다. <br />
                    *코드의 유효기간은 7일이며, 1회용입니다. <br />
                    *가입 코드는 대소문자를 구분하지 않습니다.
                </div>
				<div className="field">
					<label className="label">가입 코드</label>
					<h2 className="title has-text-centered is-2">{registerKey}</h2>
				</div>
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					생성
				</button>
			</div>
		</div>
	);
}

export default inject('serviceStore')(observer(CreateKey));
