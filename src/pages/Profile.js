import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Orders from '../components/profile/Orders'
import Address from '../components/profile/Address'
import Payment from '../components/profile/Payment'
import Settings from '../components/profile/Settings';
import Security from '../components/profile/Security'
import Information from '../components/profile/Information';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import Compressor from 'compressorjs';
import '../styles/profile.css'


export default function Profile({ hdr }) {
    const navigate = useNavigate();
    const tabsTrack = useRef();
    const profileTabs = ['Orders', 'Information', 'Address', 'Settings', 'Payment', 'Security'];
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        pImg: ''
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
    const profileEditHandler = (e) => {
        const profileInp = e.target;
        const profileEditViewer = document.createElement("div");
    
        if (profileInp && profileInp.files[0]) {
            const file = profileInp.files[0];
            const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
            const compressImage = async () => {
                try {
                    const compressedBlob = await new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.5,
                            maxWidth: 500,
                            maxHeight: 500,
                            mimeType: "image/jpeg",
                            success(result) {
                                resolve(result);
                            },
                            error(error) {
                                reject(error);
                            },
                        });
                    });
    
                    const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
                    const compressedImageUrl = URL.createObjectURL(compressedBlob);
    
                    profileEditViewer.className = "profile-edit-popup";
                    profileEditViewer.innerHTML = `
                        <div class="profile-edit-popup-inner">
                            <img src="${compressedImageUrl}" alt="preview" />
                            <p class="tertiary-color">Original Size: ${originalSizeMB} MB</p>
                            <p class="tertiary-color">Compressed Size: ${compressedSizeMB} MB</p>
                            <div class="profile-save-cancel">
                                <button class="profile-edit-cancel">Cancel</button>
                                <button class="profile-edit-save">Save</button>
                            </div>
                        </div>`;

                    profileEditViewer.classList.add('active');
                    document.body.appendChild(profileEditViewer);
    
                    document.querySelector(".profile-edit-save").addEventListener("click", async () => {
                        const formData = new FormData();
                        formData.append("file", compressedBlob, `${userData.id}.jpg`);
                        try {
                            const response = await fetch(process.env.REACT_APP_API_URL+`/api/v1/user/update/profile/image?id=${userData.id}`, {
                                method: "POST",
                                body: formData,
                            });
    
                            const result = await response.json();
                            if(result){
                                setUserData(prevState => ({
                                    ...prevState,
                                    pImg: 'uploads/p/'+result.filename
                                }));
                                document.querySelector('.profile-picture-img .profile-hero-image').src = compressedImageUrl
                                profileEditViewer.classList.remove('active');
                                setTimeout(() => profileEditViewer.remove(), 500);
                                console.log("Upload Success:", result);
                            }
                        } catch (error) {
                            console.error("Upload Error:", error);
                        }
                    });
    
                    document.querySelector(".profile-edit-cancel").addEventListener("click", () => {
                        profileEditViewer.classList.remove('active');
                        setTimeout(() => {
                            profileEditViewer.remove();
                        }, 500);
                    });
    
                } catch (error) {
                    console.error(error);
                }
            };
            if(originalSizeMB > 10){
                alert("Please select smaller sized image");
            }else {
                compressImage();
            }
        }
    };

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
            address: data.address,
            pImg: data.profileImg ? data.profileImg : ''
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
                        <small className='tertiary-color'><span className='hide-email-title'>User ID: </span>{userData.id}</small>
                    </div>
                    {/* <div className="profile-circle-progress">
                        <svg role="progressbar" width={200} height={200} viewBox="0 0 100 100" aria-valuemin={0} aria-valuemax={100} aria-valuenow={75} >
                            <circle cx="50%" cy="50%" r={42} shapeRendering="geometricPrecision" fill="none" stroke="#e6e6e6" strokeWidth={10} />
                            <defs>
                                <linearGradient id="linear-4">
                                    <stop offset="0%" stopColor="yellow" />
                                    <stop offset="100%" stopColor="#ff0000" />
                                </linearGradient>
                            </defs>
                            <circle cx="50%" cy="50%" r={42} shapeRendering="geometricPrecision" className="pie-circle-4" fill="none" strokeWidth={10} strokeDashoffset={66} strokeDasharray={264} strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} stroke="url(#linear-4)" data-angel={75} />
                            <text className="progress-text" x="50%" y="50%" fill="#000" textAnchor="middle" dy="0.35em" fontSize="1.6rem" fontWeight={400}>
                                <tspan className="progress-percentage">75</tspan>
                                <tspan>%</tspan>
                            </text>
                        </svg>
                    </div> */}
                    <div className="profile-picture-img">
                        {
                            userData && userData.pImg ? <img className='profile-hero-image' src={process.env.REACT_APP_API_URL+'/'+userData.pImg} alt="profile" /> : <UserIcon />
                        }
                        <span className="edit-icon">
                            <EditIcon />
                            <input type="file" onChange={profileEditHandler} />
                        </span>
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
                            {profileTabs.map((tab, i) => {
                                const Comp = tabs.filter((v) => v.name === tab)[0].component;
                                return <Comp key={i} id={userData.id} data={userData} />;
                            }
                            )}
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