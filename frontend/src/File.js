import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

function File({ serviceStore }) {
	const [fileData, setFileData] = useState({
		fileHash: '',
		originalName: '',
		fileType: '',
	});
	const [pageList, setPageList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
	const volume = useRef(0.5);

    const history = useHistory();

	const { fileHash } = useParams();

	useEffect(() => {
        if (!serviceStore.isLogined) return;
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/file/get-data?file=' + fileHash).then((response) => {
			setFileData(response.data.data);
		});
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/file/page-include?file=' + fileHash).then((response) => {
			setPageList(response.data.data);
		});
	}, [serviceStore.isLogined, fileHash, setFileData]);

    const onDeleteClick = async () => {
        if (!window.confirm('정말 파일을 삭제하시겠습니까? 본 파일을 사용하는 페이지에서 더이상 파일을 로드할 수 없습니다.')) return alert('취소되었습니다.');
        const response = await axios.delete(process.env.REACT_APP_REQUEST_URL + '/api/file/delete?file=' + fileHash);
        if (response.data.status) alert('파일이 삭제되었습니다');
        history.goBack();
    };

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered">파일 상세 정보</h2>
            <button className="button is-primary is-light" style={{ marginLeft: '1rem' }} onClick={onDeleteClick}>파일 삭제</button>
			<p style={{ margin: '1rem', overflow: 'auto' }}>파일 해시(SHA-256): {fileHash}</p>
			<p style={{ margin: '1rem' }}>최초 업로드 이름: {fileData.originalName}</p>
			<p style={{ margin: '1rem' }}>파일 타입: {fileData.fileType}</p>
			<p style={{ margin: '1rem' }}>
				이 파일을 사용하는 페이지:{' '}
				{pageList.map((page, idx) => {
					return (
						<>
							<Link to={'/page/' + page.pageId} key={idx}>
								{page.pageTitle}
							</Link>
							{', '}
						</>
					);
				})}
			</p>
			<div style={{ margin: '1rem' }}>
				<p className="mb-4">파일 미리보기</p>
				{
                    fileData.fileType.startsWith('image') ? <img src={process.env.REACT_APP_REQUEST_URL + '/api/file/get/' + fileHash} alt="alt text"></img> 
                    : <>
					    <span>{isLoaded ? '' : 'Loading...'}</span>
					    <ReactAudioPlayer 
                            src={process.env.REACT_APP_REQUEST_URL + '/api/file/get/' +  fileHash} 
                            style={{ margin: '10px' }} 
                            volume={volume.current} 
                            onCanPlayThrough={() => setIsLoaded(true)} 
                            onVolumeChanged={(v) => (volume.current = v)}
                            controls
                        />
				    </>
                }
			</div>
		</div>
	);
}
export default inject('serviceStore')(observer(File));
