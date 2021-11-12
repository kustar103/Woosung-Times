import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router-dom';

function Project({ serviceStore }) {
	const history = useHistory();
	const [project, setProject] = useState({});
	const [pageList, setPageList] = useState([]);
	const { projectId } = useParams();
	useEffect(() => {
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/project/get?projectId=' + projectId).then((response) => {
			setProject(response.data.data);
		});
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/page/get-list?projectId=' + projectId).then((response) => {
			setPageList(response.data.data);
		});
	}, [setProject, projectId]);

	const onClickDelete = async () => {
		const result = prompt(`정말 삭제하시겠습니까? 삭제하시려면 프로젝트 이름 "${project.projectName}"을 입력하십시오.`);
		if (result !== project.projectName) return alert('취소되었습니다.');
		const response = await axios.delete(process.env.REACT_APP_REQUEST_URL + '/api/project/delete?projectId=' + projectId);
		if (response.data.status) {
			alert('삭제되었습니다.');
			history.goBack();
		}
	};

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered">{project.projectName}</h2>
			{serviceStore.isLogined && (
				<div className="box">
					<div className="title is-6 has-text-centered">관리자 영역</div>
					<div className="buttons is-centered">
						<button className="button is-primary is-light" onClick={onClickDelete}>
							프로젝트 삭제
						</button>
						<button
							className="button is-primary is-light"
							onClick={() => {
								history.push({
									pathname: '/create-project',
									state: {
										project,
									},
								});
							}}>
							프로젝트 수정
						</button>
						<button
							className="button is-primary is-light"
							onClick={() => {
								history.push({
									pathname: '/create-page',
									state: {
										page: {
											projectId,
										},
									},
								});
							}}>
							페이지 업로드
						</button>
					</div>
				</div>
			)}
			{pageList.map((page) => {
				return (
					<div style={{ padding: '1rem' }} key={page.pageId}>
						<Link to={'/page/' + page.pageId}>{page.pageTitle}</Link>
					</div>
				);
			})}
		</div>
	);
}
export default inject('serviceStore')(observer(Project));
