import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as CalenderIcon } from '../../assets/icons/calender.svg';
import apiService from '../../services/apiService';


const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

export default function Information({ data }) {
    const editBtn = useRef();
    const updateAndSaveBtn = useRef();
    const userInfoContainer = useRef();
    const [date, setDate] = useState(getCurrentDate());
    const [info, setInfo] = useState({});

    const convertToDisplayFormat = (dateStr) => {
        const [yyyy, mm, dd] = dateStr.split("-");
        return `${dd}/${mm}/${yyyy}`;
    };

    const editInfoHandler = () => {
        const inputs = userInfoContainer.current.querySelectorAll('input');

        inputs.forEach((inp) => {
            if(inp.name === 'name'){
                inp.readOnly = false;
                inp.focus();
            }
            if(inp.type !== 'email'){
                inp.readOnly = false;
            }
        });
        userInfoContainer.current.classList.add('editmode');
        editBtn.current.classList.add('hide');
        updateAndSaveBtn.current.classList.remove('button-disable');
    }

    const inpHandler = (e) => {
        const inputValue = e.target.value;
        const cleanedValue = inputValue.replace(/[^0-9.-]/g, '');
        if (inputValue !== cleanedValue) {
            e.target.value = cleanedValue;
        }
    }

    const genderOptHandler = (e) => {
        const tr = e.target;
        console.log(tr)
        const inp = tr.querySelector('input');
        inp.checked = true;
    }

    const updateAndSaveHandler = (e) => {
        try {
            const tr = e.target;
            const parent = tr.closest('.user-info-container');
            const name = parent.querySelector('.profile-info-name').value;
            const email = parent.querySelector('input[type="email"]').value.toLowerCase();
            const number = parent.querySelector('.profile-info-number').value;
            const dobInp = parent.querySelector('input[type="date"]');
            const dob = convertToDisplayFormat(dobInp.value);
            const gender = parent.querySelector('input[name="gender"]:checked').dataset.gender;
            const dataObj = {
                id: data.id,
                name: name,
                email: email,
                number: number,
                dob: dob,
                gender: gender
            }

            tr.classList.add('loading');
            fetch(process.env.REACT_APP_API_URL+'/api/v1/user/update/info', {
                method: 'post',
                headers:{
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(dataObj)
            }).then((res) => res.json()).then((data) => {
                console.log(data);
                userInfoContainer.current.classList.remove('editmode');
                editBtn.current.classList.remove('hide');
                updateAndSaveBtn.current.classList.add('button-disable');
                tr.classList.remove('loading');
            }).catch((err) => {
                console.log('Error while updating info: ', err);
            })
        } catch (error) {
            console.log(error);
        }
    }

    const genderChangeHandler = () => {
        console.log('helo')
    }

    useEffect(() => {
        const fn = async () => {
            const result = await apiService.post('/api/v1/user/info', {id: data.id});

            if(!result.error){
                setInfo(result);
            }
        }
        fn();
    }, [data.id])
    return (
        <div className='tab-container information-tab'>
            <div className="tab-heading df alic jstfy-btwn mb10">
                <h3>Personal Information</h3>
                <span className="edit-info pr-color u_sel_none" onClick={editInfoHandler} ref={editBtn}>Edit Profile</span>
            </div>
            <div className="user-info-container" ref={userInfoContainer}>
                <div className="info-row">
                    <span className="info-title">Name</span>
                    <input type="text" defaultValue={info.name} name='name' className='profile-info-name' readOnly={true} />
                </div>
                <div className="info-row">
                    <span className="info-title">Email</span>
                    <input type="email" defaultValue={info.email} readOnly={true} />
                </div>
                <div className="info-row phone-no">
                    <span className="info-title">Phone Number</span>
                    <div className="df alic gap5 inp-and-code">
                        <div className="country-flag-and-code df alic u_sel_none">
                            <span className='tertiary-color'>+880</span>
                        </div>
                        {info.phone ? <input type="number" className='profile-info-number' onKeyUp={inpHandler} defaultValue={info.phone} readOnly={true} /> : <input type="number" className='profile-info-number' onKeyUp={inpHandler} placeholder='Add Your Number' />}
                    </div>
                </div>
                <div className="info-row">
                    <span className="info-title">Date Of Birth</span>
                    <div className="dob-inp">
                        <p className='date-displayer tertiary-color u_sel_none'>
                            {data.number ? data.number : convertToDisplayFormat(date)}
                        </p>
                        {info.dob ? <input type="date" defaultValue={info.dob} readOnly={true} /> : <input type="date" readOnly={false} onChange={(e) => setDate(e.target.value)} />}
                        <span className='calender-icon'>
                            <CalenderIcon width={23} height={23} />
                        </span>
                    </div>
                </div>
                <div className="info-row gender">
                    <span className="info-title">Gender</span>
                    <div className="df alic gender-options">
                        <div className="gndr-sel-opt" onClick={genderOptHandler}>
                            <input type="radio" name="gender" data-gender="male" checked={info.gender === 'male' ? true : false} onChange={genderChangeHandler}/>
                            <span>Male</span>
                        </div>
                        <div className="gndr-sel-opt" onClick={genderOptHandler}>
                            <input type="radio" name="gender" data-gender="female" checked={info.gender === "female" ? true : false} onChange={genderChangeHandler}/>
                            <span>Female</span>
                        </div>
                        <div className="gndr-sel-opt" onClick={genderOptHandler}>
                            <input type="radio" name="gender" data-gender="custom" checked={info.gender === 'custom' ? true : false} onChange={genderChangeHandler}/>
                            <span>Custom</span>
                        </div>
                        <div className="gndr-sel-opt" onClick={genderOptHandler}>
                            <input type="radio" name="gender" checked={info.gender === 'unspecified' ? true : false} data-gender="unspecified" onChange={genderChangeHandler}/>
                            <span>Unspecified</span>
                        </div>
                    </div>
                </div>
                <div className="df alic jstfy-e">
                    <button className="update-and-save sign-anim-btn button-disable" onClick={updateAndSaveHandler} ref={updateAndSaveBtn}>Update & Save</button>
                </div>
            </div>
        </div>
    )
}