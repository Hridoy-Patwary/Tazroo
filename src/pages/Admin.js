import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/admin.css';
import AddProductAdmin from '../components/admin/AddProductAdmin';
import AdminLeftBar from '../components/admin/AdminLeftBar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminCheckOrder from '../components/admin/AdminCheckOrder';
import AdminCheckUser from '../components/admin/AdminCheckUser';
import ProductList from '../components/admin/ProductList';
import Orders from '../components/admin/Orders';
import Feedback from '../components/admin/Feedback';

export default function Admin({ hdr }) {
    const [currentPage, setCurrentPage] = useState('overview');
    const navigate = useNavigate();
    const location = useLocation();
    const panelOuterRef = useRef();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    if (!getCookie('panel') || getCookie('panel') === 'false') {
        navigate('/admin/login');
    }

    const renderAdminPanelPage = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'overview':
                return <AdminOverview />;
            case 'add-product':
                return <AddProductAdmin />;
            case 'product-list':
                return <ProductList />;
            case 'check-order':
                return <AdminCheckOrder />;
            case 'check-user':
                return <AdminCheckUser />;
            case 'feedback': 
                return <Feedback />
            case 'orders':
                return <Orders />
            default:
                return <AdminOverview />;
        }
    };

    const adminMenuHandler = () => {
        panelOuterRef.current.classList.toggle('active');
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = params.get('pg');
        if (page) {
            setCurrentPage(page);
        }
        hdr(false);
    }, [location.search, hdr]);

    return (
        <div className='admin-panel-container'>
            <div className="admin-left-panel-outer" ref={panelOuterRef}>
                <span className='current-page-pos-fixed'>{currentPage.replaceAll('-', ' ')}</span>
                <AdminLeftBar render={renderAdminPanelPage} />
            </div>
            <div className="admin-panel-overflow-scroller">
                {renderPage()}
            </div>
            <div className="header-menu" onClick={adminMenuHandler}>
                <input type="checkbox" />
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}