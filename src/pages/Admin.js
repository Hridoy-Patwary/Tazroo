import React, { useEffect, useState } from 'react'
import '../styles/admin.css'
import AddProductAdmin from '../components/admin/AddProductAdmin'
import AdminLeftBar from '../components/admin/AdminLeftBar'
import AdminOverview from '../components/admin/AdminOverview';
import AdminCheckOrder from '../components/admin/AdminCheckOrder'
import AdminCheckUser from '../components/admin/AdminCheckUser'
import { useNavigate } from 'react-router-dom';

export default function Admin({ hdr }) {
    const [currentPage, setCurrentPage] = useState('overview');
    const navigate = useNavigate();


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    if(!getCookie('panel') || getCookie('panel') === 'false'){
        navigate('/admin/login');
    }

    const renderAdminPanelPage = (page) => {
        setCurrentPage(page);
    }

    const renderPage = () => {
        switch(currentPage) {
            case 'overview':
                return <AdminOverview />;
            case 'add-product':
                return <AddProductAdmin />;
            case 'check-order':
                return <AdminCheckOrder />
            case 'check-user':
                return <AdminCheckUser />
            default:
                return <AdminOverview />
        }
    }

    useEffect(() => {
        hdr(false);
    }, [hdr]);
    return (
        <div className='admin-panel-container'>
            <AdminLeftBar render={renderAdminPanelPage} />
            <div className="admin-panel-overflow-scroller">
                {renderPage()}
            </div>
        </div>
    )
}
