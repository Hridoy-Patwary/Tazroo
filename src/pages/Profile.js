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
        const udFromLocal = localStorage.getItem('ud');
        if(udFromLocal === 'undefined' || !udFromLocal) navigate('/account');
        
        const data = JSON.parse(udFromLocal);
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
                    <h3>Welcome back {userData.name.split(' ')[0]}!</h3>
                    <p>{userData.email}</p>
                    <p><small>{userData.id}</small></p>
                    <button className='log-out-btn' onClick={logOutHandler}>Log Out</button>
                </div>
            </div>
        </div>
    )
}