import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ hdr }) {
    const usernameInp = useRef();
    const passwordInp = useRef();
    // const [username, setUsername] = useState();
    const navigate = useNavigate();

    const setCookieFunction = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    // const getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(";").shift();
    //     return null;
    // };


    // const updateCookie = () => {
    //     setCookieFunction("custom-cookie", username, 7);
    // };

    const inputChecker = () => {
        const inputs = passwordInp.current.parentElement.querySelectorAll('input');
        let empty = false;
        
        inputs.forEach((inp) => {
            if(inp.value === ''){
                empty = true;
                inp.style.borderColor = 'red';
            }else {
                inp.style = '';
            }
        });
        return empty;
    }

    const handleAdminLogin = (e, f) => {
        const tr = f ? e : e.target;
        tr.classList.add('loading');

        const empty = inputChecker();
        const credentials = {
            username: usernameInp.current.value,
            pass: passwordInp.current.value
        };

        if(!empty){
            fetch(process.env.REACT_APP_API_URL+'/api/v1/admin/login', {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(credentials)
            }).then((res) => res.json()).then((data) => {
                if (data.error) {
                    alert(data.error.message);
                } else {
                    setCookieFunction('panel', true, 1);
                    navigate('/admin');
                }
                tr.classList.remove('loading');
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    const inpHandler = (e) => {
        if(e.keyCode === 13){
            const empty = inputChecker();

            if(!empty){
                handleAdminLogin(e.target.parentElement.querySelector('.admin-login-btn'), true);
            }
        }
    }


    useEffect(() => {
        hdr(false);
    }, [hdr]);

    return (
        <div className='admin-login'>
            <div className="login-inner">
                <h3 style={{color: 'black'}}>Admin Login</h3>
                <input type="text" placeholder='Username' ref={usernameInp} onKeyDown={inpHandler} />
                <input type="password" placeholder='Password' ref={passwordInp} onKeyDown={inpHandler} />
                <div className="t-center">
                    <button className='admin-login-btn sign-anim-btn' onClick={handleAdminLogin}>Login</button>
                </div>
            </div>
        </div>
    )
}
