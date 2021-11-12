import React, { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { observer, inject, Provider, Observer } from 'mobx-react';
import ProjectList from './ProjectList';
import Project from './Project';
import Page from './Page';
import Login from './Login';
import SignUp from './SignUp';
import CreateProject from './CreateProject';
import 'bulma/css/bulma.min.css';
import { errorHandler } from './services/error-handler';
import axios from 'axios';
import CreatePage from './CreatePage';
import { refreshToken } from './services/silent-refresh';
import ServiceStore from './stores/ServiceStore';
import CreateKey from './CreateKey';
import RecoverPw from './RecoverPw';
import FileList from './FileList';
import File from './File';

axios.interceptors.response.use(
	(response) => {
		errorHandler(response.data.data);
		return response;
	},
	(error) => {
		errorHandler(error.response.data.data);
		return error.response.data;
	}
);

const serviceStore = new ServiceStore();


(async () => {
    if (localStorage.getItem('isLogined')) {
        const result = await refreshToken();
        if (!result) return localStorage.setItem('isLogined', '');
        serviceStore.setIsLogined(true);
        serviceStore.setUserId(localStorage.getItem('userId'));
    }
})();

const MainPage = inject('serviceStore')(
	observer(({ serviceStore }) => {
		return (
			<div className="container m-auto is-max-desktop has-text-centered">
				<h1 className="title is-1" style={{ margin: '10px' }}>
					Woosung Times Article Reading
				</h1>
				<p>우성고등학교 영자신문 음성 지원</p>
				<Link to="/project">프로젝트 리스트 보기</Link> <br />
				{!serviceStore.isLogined ? (
					<Link to="/login">관리자 로그인</Link>
				) : (
					<>
						<a
							href="/"
							onClick={(e) => {
								e.preventDefault();
								serviceStore.setIsLogined(false);
								serviceStore.setUserId('');
								localStorage.clear();
								alert('로그아웃 되었습니다.');
							}}>
							로그아웃
						</a>
						<br />
						<Link to="/create-key">가입 코드 생성</Link>
                        <br />
                        <Link to="/file">파일 관리</Link>
					</>
				)}
				<br />
				<Link to="/signup">관리자 등록</Link>
			</div>
		);
	})
);

function App() {
	return (
		<Provider serviceStore={serviceStore}>
			<Route path="/" component={MainPage} exact />
			<Route path="/project" component={ProjectList} exact />
			<Route path="/create-project" component={CreateProject} exact />
			<Route path="/project/:projectId" component={Project} exact />
			<Route path="/page/:pageId" component={Page} exact />
			<Route path="/create-page" component={CreatePage} exact />
			<Route path="/login" component={Login} exact />
			<Route path="/signup" component={SignUp} exact />
			<Route path="/create-key" component={CreateKey} exact />
			<Route path="/recover/:recoverKey" component={RecoverPw} exact />
            <Route path="/file" component={FileList} exact />
            <Route path="/file/:fileHash" component={File} exact />
		</Provider>
	);
}

export default App;
