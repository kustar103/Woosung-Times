import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useLocation, useHistory } from 'react-router-dom';

function CreateProject() {
    const { state } = useLocation();

    const history = useHistory();

	const [data, setData] = useState({
        projectName: '',
        projectDescription: ''
    });

    useEffect(() => {
        if (state) {
            setData({
                ...state.project
            });
        }
    }, [setData, state]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const onClick = async () => {
        if (!data.projectName.trim()) return alert('제목을 입력해 주세요.');
        let response;
        if (state) { // update
            response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/project/update`, {
                ...data,
                projectId: state.project.projectId
            });
        } else {
            response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/project/create`, data);
        }
        response.data.status && history.goBack();
    };

	return (
		<div className="container m-auto is-max-desktop">
            <h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>프로젝트 만들기</h2>
			<div className="block">
				<input className="input" type="text" placeholder="제목" name="projectName" defaultValue={state ? state.project.projectName : ''} onChange={onChange} />
			</div>
            <div className="block">
                <input className="input" type="text" placeholder="설명(선택)" name="projectDescription" defaultValue={state ? state.project.projectDescription : ''} onChange={onChange} />
            </div>
			<div className="block">
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					작성
				</button>
			</div>
		</div>
	);
}
export default CreateProject;
