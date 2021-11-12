import React, { useEffect } from 'react';
import { refreshToken } from './services/silent-refresh';
import { inject, observer } from 'mobx-react';

function LoginWorker({ serviceStore }) {
    useEffect(() => {
		(async () => {
			if (localStorage.getItem('isLogined')) {
				const result = await refreshToken();
				if (!result) return localStorage.setItem('isLogined', '');
				serviceStore.setIsLogined(true);
				serviceStore.setUserId(localStorage.getItem('userId'));
			}
		})();
	}, [serviceStore]);
	return (
		<></>
	);
}

export default inject('serviceStore')(observer(LoginWorker));
