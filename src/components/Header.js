import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import logoWhite from '../assets/logo - white.png';
import { ThemeContext } from './ThemeToggle';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as SunIcon } from '../assets/icons/sun.svg';
import { ReactComponent as MoonIcon } from '../assets/icons/moon.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as FeaturedIcon } from '../assets/icons/featured.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import '../styles/default.css';
import '../styles/header.css';

export default function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [items, setItems] = useState();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        setItems(cartItems);
    }, [])

    return (
        <div className='header-outer'>
            <div className="container">
                <Link to={'/'} className='header-logo-container'>
                    <img src={isDarkMode ? logoWhite : Logo} alt="logo" className='header-logo' />
                </Link>
                <div className="header-search">
                    <SearchIcon width={20} height={20} fill={isDarkMode ? 'white' : 'black'} />
                    <input type="text" placeholder='Search...' />
                    <button className='search-btn'>
                        <span>Search</span>
                    </button>
                </div>
                <nav>
                    <div className="language-selection">
                        <span className='active'>EN</span>
                        <span>বাং</span>
                    </div>
                    <button onClick={toggleTheme} className='theme-toggle-btn'>
                        {isDarkMode ? (<SunIcon width="23" height="23" />) : (<MoonIcon width="23" height="23" fill="black" />)}
                    </button>
                    <Link to={"/cart"} className='header-button header-cart-btn'>
                        <CartIcon width={23} height={23} />
                        <span className={`${items ? 'active' : ''}`}>{items ? items.length : ''}</span>
                    </Link>
                    <div className="header-menu">
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
                <div className="mobile-nav">
                    <Link to={'/'} className='mobile-nav-logo-container'>
                        <img src={logoWhite} alt="logo" className='header-logo' />
                    </Link>
                    <Link to={'/featured'}>
                        <span>
                            <FeaturedIcon />
                        </span>
                        <span>Featured</span>
                    </Link>
                    <Link to={'/cart'}>
                        <span>
                            <CartIcon />
                        </span>
                        <span>Cart</span>
                    </Link>
                    <Link to={'/account'}>
                        <span>
                            <UserIcon />
                        </span>
                        <span>Account</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}