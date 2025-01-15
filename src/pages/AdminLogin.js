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

    const handleAdminLogin = () => {
        const credentials = {
            username: usernameInp.current.value,
            pass: passwordInp.current.value
        };
        fetch('http://localhost:4000/api/v1/admin/login', {
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
        }).catch((error) => {
            console.log(error);
        })
    }


    useEffect(() => {
        hdr(false);
    }, [hdr]);

    return (
        <div className='admin-login'>
            <div className="login-inner">
                <h3>Login Admin</h3>
                <input type="text" placeholder='Username' ref={usernameInp} />
                <input type="password" placeholder='Password' ref={passwordInp} />
                <button className='admin-login-btn' onClick={handleAdminLogin}>Login</button>
            </div>
        </div>
    )
}
