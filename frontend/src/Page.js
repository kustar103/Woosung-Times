import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import QRCode from 'qrcode.react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

function Page({ serviceStore }) {
	const { pageId } = useParams();
	const history = useHistory();
	const [pageData, setPageData] = useState({
		projectId: '',
		pageTitle: '',
		pageContent: '',
		audioId: '',
	});
	const [qrFlag, setQrFlag] = useState(false);
	const [isCopied, setCopied] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const volume = useRef(0.5);

	useEffect(() => {
		axios.get(process.env.REACT_APP_REQUEST_URL + '/api/page/get?pageId=' + pageId).then((response) => {
			if (!response.data.status) history.push('/project');
			const data = response.data.data;
			setPageData(data);
			data.pageContent && setIsLoaded(true);
		});
	}, [pageId, history]);

	const onClick = () => {
		const canvas = document.querySelector('#qr-code');
		const link = document.createElement('a');
		link.href = canvas.toDataURL('image/png'); //.replace('image/png', 'image/octet-stream');
		link.download = pageData.pageTitle + '_qr_code.png';
		link.click();
	};

	const onCopyClick = () => {
		setCopied(true);
		navigator.clipboard.writeText(window.location.href);
	};

	const onDeleteClick = async () => {
		const result = prompt(`정말 삭제하시겠습니까? 삭제하시려면 페이지 이름 "${pageData.pageTitle}"을 입력하십시오.`);
		if (result !== pageData.pageTitle) return alert('취소되었습니다.');
		const response = await axios.delete(`${process.env.REACT_APP_REQUEST_URL}/api/page/delete?pageId=${pageId}`);
		if (response.data.status) {
			alert('삭제되었습니다.');
			history.goBack();
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				marginBottom: '100px',
			}}>
			<h1 className="title is-1" style={{ margin: '10px' }}>
				<Link to="/" style={{ color: 'black' }}>
					Woosung Times
				</Link>
			</h1>
			<h2 className="title is-3" style={{ margin: '10px' }}>
				{pageData.pageTitle}
			</h2>
			{serviceStore.isLogined && (
				<div className="box">
					<div className="title is-6 has-text-centered">관리자 영역</div>
					<div className="buttons is-centered">
						<button
							class="button is-info is-light"
							onClick={() => {
								history.push({
									pathname: '/create-page',
									state: {
										page: {
											...pageData,
											isUpdate: true,
										},
									},
								});
							}}>
							페이지 수정
						</button>
						<button class="button is-info is-light" onClick={onDeleteClick}>
							페이지 삭제
						</button>
					</div>
				</div>
			)}
			{pageData.audioId && (
				<>
					<span>{isLoaded ? '' : 'Loading...'}</span>
					<ReactAudioPlayer 
                        src={process.env.REACT_APP_REQUEST_URL + '/api/file/get/' + pageData.audioId} 
                        style={{ margin: '10px' }} 
                        volume={volume.current} 
                        onCanPlayThrough={() => setIsLoaded(true)} 
                        onVolumeChanged={(v) => (volume.current = v)} 
                        autoPlay 
                        controls
                    />
				</>
			)}
			{pageData.pageContent && <div dangerouslySetInnerHTML={{ __html: pageData.pageContent }}></div>}

			<button className="button is-primary is-light" onClick={() => setQrFlag(true)} style={{ margin: '30px' }}>
				Share
			</button>
			{qrFlag ? (
				<div className="has-text-centered">
					<div className="control">
						<div className="tags has-addons is-centered">
							<span className="tag is-primary">{window.location.href}</span>
							<span className="tag is-dark" style={{ cursor: 'pointer' }} onClick={onCopyClick}>
								{isCopied ? 'Copied!' : 'Copy URL'}
							</span>
						</div>
					</div>
					<QRCode
						value={window.location.href}
						level="M"
						id="qr-code"
						size={600}
						style={{ width: '220px', height: '220px' }}
						imageSettings={{
							src: '/woosunghs_logo.png',
							excavate: true
						}}
						includeMargin
					/>
					<div>
						<Link onClick={onClick}>Download</Link>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default inject('serviceStore')(observer(Page));
