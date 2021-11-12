import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProjectList({ serviceStore }) {
	const [projectList, setProjectList] = useState([]);
	useEffect(() => {
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/project/get-list').then((response) => {
			setProjectList(response.data.data);
		});
	}, [setProjectList]);
	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered">Woosung Times Projects</h2>
			{serviceStore.isLogined && (
				<div className="box">
					<div className="title is-6 has-text-centered">관리자 영역</div>
					<div className="buttons is-centered">
						<Link className="button is-primary is-light has-text-centered" to="/create-project">
							프로젝트 만들기
						</Link>
					</div>
				</div>
			)}
			{projectList.map((project) => {
				return (
					<div style={{ padding: '1rem' }} key={project.projectId}>
						<Link to={'/project/' + project.projectId}>{project.projectName}</Link>
					</div>
				);
			})}
		</div>
	);
}
export default inject('serviceStore')(observer(ProjectList));
