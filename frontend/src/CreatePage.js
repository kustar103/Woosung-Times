import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

function CreatePage() {
	const { state } = useLocation();

	const history = useHistory();

    const editorRef = useRef();

	const [data, setData] = useState({
		pageId: '',
		pageTitle: '',
		pageContent: '',
		audioId: '',
	});

	const [file, setFile] = useState({});

	useEffect(() => {
		if (state.page.isUpdate) {
			setData({
				...state.page,
				isUpdate: undefined,
			});
		}
	}, [setData, state]);

	const onChange = (e) => {
		const { name, value } = e.target;
		setData({
			...data,
			[name]: value,
		});
	};

    const onTextChange = () => {
		setData({
			...data,
			pageContent: editorRef.current.getInstance().getMarkdown(),
		});
	};

	const onFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const onUploadClick = async () => {
		const formData = new FormData();
		formData.append('file', file, file.name);
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/file/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (response.data.status) {
			setData({
				...data,
				audioId: response.data.data,
			});
		}
		alert('업로드되었습니다.');
	};

    const uploadImage = async (blob) => {
		const formData = new FormData();
		formData.append('file', blob);
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/file/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (!response.data.status) {
			return false;
		}
		return `${process.env.REACT_APP_REQUEST_URL}/api/file/get/` + response.data.data;
	};

	const onClick = async () => {
		if (!data.pageTitle.trim()) return alert('제목을 입력해 주세요.');
		let response;
		if (state.page.isUpdate) {
			// update
			response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/page/update`, {
				...data,
				projectId: state.page.projectId,
			});
		} else {
			response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/page/create`, {
				...data,
				projectId: state.page.projectId,
			});
		}
		response.data.status && history.goBack();
	};

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>
				페이지 업로드
			</h2>
			<div className="block">
				<input className="input" type="text" placeholder="제목" name="pageTitle" defaultValue={state.page.isUpdate ? state.page.pageTitle : ''} onChange={onChange} />
			</div>
			<div className="block">
            <Editor
					initialValue={state.page.isUpdate ? state.page.pageContent : ''}
					previewStyle="vertical"
					height="700px"
					initialEditType="wysiwyg"
					ref={editorRef}
					onChange={onTextChange}
					hooks={{
						addImageBlobHook: async (blob, callback) => {
							const url = await uploadImage(blob);
							callback(url, 'alt text');
							return false;
						},
					}}
				/>
			</div>
			<div className="block">
				<div class="file is-primary has-name">
					<label class="file-label">
						<input class="file-input" type="file" onChange={onFileChange} />
						<span class="file-cta">
							<span class="file-label">음성 업로드</span>
						</span>
						<span class="file-name">{file.name}</span>
					</label>
				    <button className="button ml-2" onClick={onUploadClick}>업로드</button>
				</div>
			</div>
			<div className="block">
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					작성
				</button>
			</div>
		</div>
	);
}
export default CreatePage;
