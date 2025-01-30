import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Orders from '../components/profile/Orders'
import Address from '../components/profile/Address'
import Payment from '../components/profile/Payment'
import Settings from '../components/profile/Settings';
import Security from '../components/profile/Security'
import Information from '../components/profile/Information';
import '../styles/profile.css'


export default function Profile({ hdr }) {
    const navigate = useNavigate();
    const tabsTrack = useRef();
    const profileTabs = ['Orders', 'Information', 'Address', 'Settings', 'Payment', 'Security'];
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: ''
    });
    const tabs = [
        { name: 'Orders', component: Orders },
        { name: 'Information', component: Information },
        { name: 'Address', component: Address },
        { name: 'Payment', component: Payment },
        { name: 'Settings', component: Settings },
        { name: 'Security', component: Security },
    ];

    const logOutHandler = () => {
        localStorage.removeItem('ud');
        navigate('/account');
    }

    const tabClickHander = (e) => {
        const target = e.target;
        const tabBtnList = target.parentElement;
        const oldTabActive = tabBtnList.querySelector('.active');

        if (oldTabActive) oldTabActive.classList.remove('active');
        target.classList.add('active');

        // handle tab menu click
        const indx = target.dataset.indx;
        tabsTrack.current.style.transform = `translateX(-${indx}00%)`;
    }

    useEffect(() => {
        const udFromLocal = localStorage.getItem('ud');
        if (udFromLocal === 'undefined' || !udFromLocal) navigate('/account');

        const data = JSON.parse(udFromLocal);
        const capitalizeFirstChar = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        setUserData({
            name: data.name,
            id: data.id,
            email: capitalizeFirstChar(data.email),
            address: data.address
        });

        hdr(true);
    }, [hdr, navigate]);
    return (
        <div className='profile-container'>
            <div className="profile-page-top">
                <div className="container">
                    <div className='top-inner'>
                        <h5 className='tertiary-color'>Hello,</h5>
                        <h2>{userData.name}</h2>
                        <p className='tertiary-color'><span className='hide-email-title'>Email: </span>{userData.email}</p>
                    </div>
                    <div className="profile-circle-progress">
                        <svg
                            role="progressbar"
                            width={200}
                            height={200}
                            viewBox="0 0 100 100"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={75}
                        >
                            <circle
                                cx="50%"
                                cy="50%"
                                r={42}
                                shapeRendering="geometricPrecision"
                                fill="none"
                                stroke="#e6e6e6"
                                strokeWidth={10}
                            />
                            <defs>
                                <linearGradient id="linear-4">
                                    <stop offset="0%" stopColor="yellow" />
                                    <stop offset="100%" stopColor="#ff0000" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="50%"
                                cy="50%"
                                r={42}
                                shapeRendering="geometricPrecision"
                                className="pie-circle-4"
                                fill="none"
                                strokeWidth={10}
                                strokeDashoffset={66}
                                strokeDasharray={264}
                                strokeLinecap="round"
                                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                                stroke="url(#linear-4)"
                                data-angel={75}
                            />
                            <text
                                className="progress-text"
                                x="50%"
                                y="50%"
                                fill="#000"
                                textAnchor="middle"
                                dy="0.35em"
                                fontSize="1.6rem"
                                fontWeight={400}>
                                <tspan className="progress-percentage">75</tspan>
                                <tspan>%</tspan>
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="profile-page-main">
                <div className="container">
                    <div className="profile-page-menu-list">
                        {profileTabs.map((tab, i) => (
                            <button key={tab} className={i === 0 ? ' active' : ''} data-indx={i} onClick={(e) => tabClickHander(e)}>{tab}</button>
                        ))}
                    </div>
                    <div className="tabs-container">
                        <div className="tabs-slider-track" ref={tabsTrack}>
                            {
                                profileTabs.map((tab, i) => {
                                    const Comp = tabs.filter((v) => v.name === tab)[0].component;
                                    return <Comp key={i} id={userData.id} addr={userData.address} />;
                                })
                            }
                        </div>
                    </div>
                    <div className="profile-hero-area">
                        
                    </div>
                    <button className='log-out-btn' onClick={logOutHandler}>Log Out</button>
                </div>
            </div>
        </div>
    )
}