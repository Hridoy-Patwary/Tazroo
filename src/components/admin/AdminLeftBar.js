import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLeftBar({ render }) {
    const navigate = useNavigate();
    const location = useLocation();

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
    };

    const adminBarClickHandler = (e) => {
        const clickedItem = e.target;
        const parent = clickedItem.parentElement;
        const active = parent.querySelector('.active');
        const page = clickedItem.dataset.page;

        if (active) active.classList.remove('active');
        clickedItem.classList.add('active');
        navigate(`?pg=${page}`);
        render(page);
    };

    useEffect(() => {
        // Get current page from the URL
        const params = new URLSearchParams(location.search);
        const currentPage = params.get('pg') || 'overview';

        // Set the active class on the corresponding menu item
        const menuItems = document.querySelectorAll('.admin-left-bar li');
        menuItems.forEach((item) => {
            if (item.dataset.page === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }, [location.search]);

    return (
        <div className='admin-left-bar'>
            <ul>
                <li data-page='overview' onClick={adminBarClickHandler} className='u_sel_none'>Overview</li>
                <li data-page='add-product' onClick={adminBarClickHandler} className='u_sel_none'>Add Product</li>
                <li data-page='product-list' onClick={adminBarClickHandler} className='u_sel_none'>Product List</li>
                <li data-page='orders' onClick={adminBarClickHandler} className='u_sel_none'>Orders</li>
                <li data-page='check-order' onClick={adminBarClickHandler} className='u_sel_none'>Check Order</li>
                <li data-page='check-user' onClick={adminBarClickHandler} className='u_sel_none'>Check User</li>
            </ul>
            <button className="log-out-admin" onClick={adminLogOutHandler}>Log Out</button>
        </div>
    );
}