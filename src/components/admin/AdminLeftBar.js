import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function AdminLeftBar({ render }) {
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

    const adminLogOutHandler = () => {
        setCookieFunction('panel', 'false', 1);
        navigate('/admin');
        console.log('log out handler');
    }
    
    const adminBarClickHandler = (e) => {
        const clickedItem = e.target;
        const parent = clickedItem.parentElement;
        const active = parent.querySelector('.active');
        const page = clickedItem.dataset.page;

        active.classList.remove('active');
        clickedItem.classList.add('active');
        render(page);
    }

    return (
        <div className='admin-left-bar'>
            <ul>
                <li data-page='overview' onClick={adminBarClickHandler} className='u_sel_none active'>Overview</li>
                <li data-page='add-product' onClick={adminBarClickHandler} className='u_sel_none'>Add Product</li>
                <li data-page='check-order'onClick={adminBarClickHandler} className='u_sel_none'>Check Order</li>
                <li data-page='check-user'onClick={adminBarClickHandler} className='u_sel_none'>Check User</li>
            </ul>
            <button className="log-out-admin" onClick={adminLogOutHandler}>Log Out</button>
        </div>
    )
}