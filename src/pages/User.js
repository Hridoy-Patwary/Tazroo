import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import apiService from '../services/apiService';
import Logo from '../assets/logo.png';
import '../styles/account.css'

export default function User({ hdr }) {
    const navigate = useNavigate();
    const location = useLocation();
    const passwordWarning = useRef();
    const isAccount = location.pathname.includes('account');

    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const alreadyHaveAccHandler = (e) => {
        const sliderMainContainer = e.target.closest('.slider-main-container');
        const signInUpBar = sliderMainContainer.previousElementSibling;
        const barInner = signInUpBar.querySelector('.sign-up-or-sign-in');
        const activeElmInBar = barInner.querySelector('.active');
        const allSignIn = sliderMainContainer.querySelectorAll('.content-sign-in');
        const allSignUp = sliderMainContainer.querySelectorAll('.content-sign-up');
        const allInputs = sliderMainContainer.querySelectorAll('input');

        sliderMainContainer.classList.toggle('active');
        activeElmInBar.classList.remove('active');
        allInputs.forEach((inp) => inp.value = '');

        if (sliderMainContainer.classList.contains('active')) {
            allSignIn.forEach((elm) => elm.classList.remove('active'));
            allSignUp.forEach((elm) => elm.classList.add('active'));
            barInner.querySelector('.up').classList.add('active');
            barInner.classList.remove('in');
            barInner.classList.add('up');
        } else {
            allSignIn.forEach((elm) => elm.classList.add('active'));
            allSignUp.forEach((elm) => elm.classList.remove('active'));
            barInner.querySelector('.in').classList.add('active');
            barInner.classList.add('in');
            barInner.classList.remove('up');
        }
        setData({
            name: '',
            email: '',
            password: ''
        });
    }

    const signBtnHandler = (e) => {
        const btn = e.target;
        const parent = btn.parentElement;
        const active = parent.querySelector('.active');
        const sliderContainer = document.querySelector('.slider-main-container');

        if (btn.classList.contains('up')) {
            parent.classList.remove('in');
            parent.classList.add('up');
            active.classList.remove('active');
            btn.classList.add('active');
            sliderContainer.classList.add('active');
        } else {
            parent.classList.remove('up');
            parent.classList.add('in');
            active.classList.remove('active');
            btn.classList.add('active');
            sliderContainer.classList.remove('active');
        }
    }

    const handleInputs = (e) => {
        const { name, value } = e.target;
        
        if(value !== ""){
            if(name === 'password' && value.length >= 8){
                e.target.style = '';
                passwordWarning.current.classList.add('hide')
            }else if(name !== 'password'){
                e.target.style = '';
            };
        };
        setData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    const inputsVarificationHandler = (inputParent, sign) => {
        const inputs = inputParent.querySelectorAll('input');
        let varified = true;
        
        inputs.forEach((inp) => {
            const {name, type} = inp;
            const value = inp.value;
            const length = value.length;


            if(sign === 'up' && name === 'password'){
                if(length < 8){
                    varified = false;
                    inp.style.borderColor = 'var(--warning)';
                    if(value !== '') passwordWarning.current.classList.remove('hide');
                }else {
                    inp.style = ''
                    passwordWarning.current.classList.add('hide')
                };
            }else if(value === '' && type !== 'checkbox'){
                varified = false;
                inp.style.borderColor = 'var(--warning)';
            }else if(name === 'cf-password' && data.password !== value){
                varified = false;
                inp.style.borderColor = 'var(--warning)';
            }else inp.style = ''
        });
        return varified;
    }

    // const userSignInUpHandler = async (sign, data) => {
    //     const apiEndPoint = '/api/v1/user' + sign === 'in' ? 'login' : 'signup';

    //     return await apiService.post(apiEndPoint, data);
    // }

    const themeHandlerForAccountPage = () => {
        const currentTheme = localStorage.getItem('theme');
        const themeColor = document.querySelector('meta[name="theme-color"]');
        const themeClr = currentTheme === 'dark' ? themeColor.getAttribute('next') : themeColor.getAttribute('default');

        themeColor.setAttribute('content', currentTheme === null ? themeColor.getAttribute('default') : themeClr);
    }


    const signInHandler = async (e) => {
        const targetBtn = e.target;
        try {
            const varified = inputsVarificationHandler(targetBtn.closest('.content-container'), 'in');

            if (varified) {
                targetBtn.classList.add('loading');
                await fetch(process.env.REACT_APP_API_URL + '/api/v1/user/login', {
                    method: 'post',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((res) => res.json()).then((data) => {
                    localStorage.setItem('ud', JSON.stringify(data.data));
                    themeHandlerForAccountPage();
                    navigate('/profile');
                }).catch((err) => {
                    targetBtn.classList.remove('loading');
                    console.log(err);
                })
            }
        } catch (error) {
            targetBtn.classList.remove('loading');
            console.log(error);
        }
    }

    const signUpHandler = async (e) => {
        const targetBtn = e.target;
        try {
            const varified = inputsVarificationHandler(targetBtn.closest('.content-container'), 'up');
            if (varified) {
                targetBtn.classList.add('loading');
                await fetch(process.env.REACT_APP_API_URL + '/api/v1/user/signup', {
                    method: 'post',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((res) => res.json()).then((data) => {
                    themeHandlerForAccountPage();
                    localStorage.setItem('ud', JSON.stringify(data.data));
                    navigate('/profile');
                }).catch(err => {
                    targetBtn.classList.remove('loading');
                    console.log(err);
                })
            }
        } catch (error) {
            targetBtn.classList.remove('loading');
            console.log(error);
        }
    }

    const forgotPassHandler = () => {
        console.log('forget!');
    }

    useEffect(() => {
        if(isAccount){
            const themeColor = document.querySelector('meta[name="theme-color"]');
            themeColor.setAttribute('content', 'rgb(42 184 115)');
            document.documentElement.setAttribute('pg', 'account');
        }else{
            document.documentElement.removeAttribute('pg');
        }
        hdr(false);
    }, [hdr, isAccount])
    return (
        <div className='account-user-container'>
            <div className="account-outer-container active-anim">
                <div className="sign-in-or-sign-up-outer">
                    <div className="sign-up-or-sign-in u_select_none in">
                        <div className="up u_sel_none" onClick={signBtnHandler}>Sign Up</div>
                        <div className="in active u_sel_none" onClick={signBtnHandler}>Sign In</div>
                    </div>
                </div>
                <div className="slider-main-container">
                    <div className="content-left content-container">
                        <div className="content-sign-up content-box">
                            <h1>Sign Up</h1>
                            <p className="sub-title">Welcome to coinly!</p>
                            <div className="desc">
                                <p>Create an account to use coinly in a better way!</p>
                                <p>Tazroo provides best user experience for tracking your expenses with
                                    all device support, you can also share you expenses to your friends
                                    who has also an Coinly account. your data will be saved securely in
                                    our database you'll be able to access in any device and from
                                    anywhere you want.</p>
                                <p>Our main goal is to provide best user experience across all devices
                                    with world class security. Sign Up in Coinly and Enjoy!</p>
                            </div>
                        </div>
                        <div className="content-sign-in active">
                            <Link to={'/'} className="logo-container">
                                <img src={Logo} width={110} alt="logo" />
                            </Link>
                            <div className="inputs-container">
                                <input type="email" placeholder="Email" name="email" onChange={handleInputs} />
                                <input type="password" placeholder="Password" name="password" onChange={handleInputs} />
                            </div>
                            <div className="remember-this-device">
                                    <input type="checkbox" id="remember" name="remember" defaultValue="" />
                                    <label htmlFor="remember">Remember this device</label>
                                </div>
                            <div className="t-center sign-btn-container">
                                <button className="signin sign-anim-btn" onClick={signInHandler}>Sign In</button>
                            </div>
                            <p className="already-have-acc">
                                <span>Don't have an account? </span>
                                <span onClick={alreadyHaveAccHandler}>Sign Up</span>
                            </p>
                            <div className="t-center">
                                <button className="forgot-password pr-color" onClick={forgotPassHandler}>Forgotten Password?</button>
                            </div>
                        </div>
                    </div>
                    <div className="content-right content-container">
                        <div className="content-sign-up">
                            <Link to={'/'} className="logo-container">
                                <img src={Logo} width={110} alt="logo" />
                            </Link>
                            <div className="inputs-container">
                                <input type="text" placeholder="Full Name" name="name" onChange={handleInputs} />
                                <input type="email" placeholder="Email" name="email" onChange={handleInputs} />
                                <input type="password" placeholder="Password" name="password" onChange={handleInputs} />
                                <span className='password-length-warning hide' ref={passwordWarning}>Password needs to be at least 8 characters</span>
                                <input type="password" placeholder="Confirm password" name="cf-password" onChange={handleInputs} />
                            </div>
                            <div className="t-center sign-btn-container">
                                <button className="signup sign-anim-btn" onClick={signUpHandler}>Sign Up</button>
                            </div>
                            <p className="already-have-acc mb5">
                                <span>Already have an account? </span>
                                <span onClick={alreadyHaveAccHandler}>Sign In</span>
                            </p>
                            <p className="get-newsletter-updates df alic gap5 jstfy-c">
                                <input type="checkbox" name="newsletter-update" />
                                <span>Get newsletter & certfied product updates</span>
                            </p>
                            {/* <div className="social-login-container t-center">
                                <p className="social-login-title">Continue with socials</p>
                                <div className="social-login">
                                    <div className="login-with google" title="Sign up with Google">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25} ><path d="m22.6 12.3-.2-2.3H12v4.3h6a5 5 0 0 1-2.3 3.3v2.7h3.6q3.2-3 3.3-8" fill="#4285F4" /><path d="M12 23q4.6 0 7.3-2.7l-3.6-2.7q-1.5 1-3.7 1a7 7 0 0 1-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23" fill="#34A853" /><path d="M5.8 14a7 7 0 0 1 0-4V7H2.2a11 11 0 0 0 0 10L5 14.6z" fill="#FBBC05" /><path d="M12 5.4A6 6 0 0 1 16.2 7l3.2-3q-3-3-7.4-3a11 11 0 0 0-9.8 6l3.6 3A7 7 0 0 1 12 5.3" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                                        </span>
                                    </div>
                                    <div className="login-with facebook" title="Sign up with Facebook">
                                        <span>
                                        <svg width={25} height={25} viewBox="0 0 666.7 666.7" ><defs><clipPath clipPathUnits="userSpaceOnUse"><path d="M0 700h700V0H0Z" /></clipPath></defs><g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 -133.3 800)" ><path d="M600 350a250 250 0 1 1-310.4-242.6v166.2h-51.5V350h51.5v33c0 85 38.5 124.5 122 124.5 15.9 0 43.2-3.2 54.4-6.3V432c-5.9.6-16.1 1-28.9 1-41 0-56.8-15.6-56.8-56v-27h81.6l-14-76.4h-67.6V101.8A250 250 0 0 1 600 350" fill="#0866ff" /><path d="m448 273.6 14 76.4h-81.6v27c0 40.4 15.8 56 56.8 56 12.7 0 23-.4 28.9-1v69.2a276 276 0 0 1-54.4 6.2c-83.5 0-122-39.4-122-124.5V350H238v-76.4h51.6V107.4a251 251 0 0 1 90.7-5.6v171.8Z" fill="#fff" /></g></svg>
                                        </span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="content-sign-in content-box active">
                            <h1>Sign In</h1>
                            <p className="sub-title">Hey, welcome back!</p>
                            <div className="desc">
                                <p>It's good to have you back...</p>
                                <p>Sign In to get and sync all of your old data on this device.</p>
                                <p>
                                    Signing in to Coinly will retrive all of your old data (sheets,
                                    expenses &amp; categories) to this device and Coinly will remember
                                    this device for future access. you can remove it anytime you want.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
