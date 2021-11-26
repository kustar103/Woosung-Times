import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FileList({ serviceStore }) {
	const [fileList, setFileList] = useState([]);
    const [lastId, setLastId] = useState('');
    const [isMore, setIsMore] = useState(true);

	useEffect(() => {
        if (!serviceStore.isLogined) return;
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/file/get-list').then((response) => {
            const list = response.data.data;
			setFileList(s => [...s, ...list]);
            setLastId(list[list.length - 1]._id);
            if (list.length < 25) setIsMore(false);
		});
	}, [serviceStore.isLogined, setFileList, setLastId, setIsMore]);

    const onClick = () => {
        axios.get(process.env.REACT_APP_REQUEST_URL + '/api/file/get-list', { startId: lastId }).then((response) => {
            const list = response.data.data;
			setFileList(s => [...s, ...list]);
            setLastId(list[list.length - 1]._id);
            if (list.length < 25) setIsMore(false);
		});
    };

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
            { isMore && <button className="button is-primary is-fullwidth" onClick={onClick}>More</button> }
		</div>
	);
}
export default inject('serviceStore')(observer(FileList));
