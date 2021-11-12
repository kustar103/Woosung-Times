import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FileList({ serviceStore }) {
	const [fileList, setFileList] = useState([]);

	useEffect(() => {
        if (!serviceStore.isLogined) return;
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/file/get-list').then((response) => {
			setFileList(response.data.data);
		});
	}, [serviceStore.isLogined, setFileList]);

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered">업로드된 파일</h2>
			{fileList.map((file, index) => {
				return (
					<div style={{ padding: '1rem' }} key={index}>
						<Link to={'/file/' + file.fileHash}>{file.originalName}</Link>
					</div>
				);
			})}
		</div>
	);
}
export default inject('serviceStore')(observer(FileList));
