import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css'

export default function Profile({ hdr }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: ''
    });

    const logOutHandler = () => {
        localStorage.removeItem('ud');
        navigate('/account');
    }

    useEffect(() => {
        if(!localStorage.getItem('ud')) navigate('/account');
        const data = JSON.parse(localStorage.getItem('ud'));
        setUserData({
            name: data.name,
            id: data.id,
            email: data.email
        });

        hdr(true);
    }, [hdr, navigate]);
    return (
        <div className='profile-container'>
            <div className="container">
                <div className="profile-hero-area">
                    <h3>{userData.name}</h3>
                    <p>{userData.email}</p>
                    <p><small>{userData.id}</small></p>
                    <button className='log-out-btn' onClick={logOutHandler}>Log Out</button>
                </div>
            </div>
        </div>
    )
}