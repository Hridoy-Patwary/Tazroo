import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import logoWhite from '../assets/logo - white.png';
import { ThemeContext } from './ThemeToggle';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import '../styles/default.css';
import '../styles/header.css';
import ThemeToggleIcon from './ThemeToggleIcon';

export default function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [scrollDirection, setScrollDirection] = useState(null);
    const [items, setItems] = useState();
    const isDarkMode = theme === 'dark';


    const handleLanguage = (e) => {
        const languageBtn = e.target;
        const langSelectParent = languageBtn.parentElement;
        const activeBtn = langSelectParent.querySelector('.active');
        const unactiveBtn = langSelectParent.querySelector('.unactive');
        const selectedLang = languageBtn.dataset.lang;

        activeBtn.className = 'unactive';
        unactiveBtn.className = 'active';
        langSelectParent.classList.toggle('bn');
        console.log(selectedLang);
    }

    const handleNavMenuClick = (e) => {
        const headerOuter = e.target.closest('.header-outer');
        headerOuter.classList.toggle('active');
    }


    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem("cart"));

        let lastScrollY = window.scrollY; // Keep track of the last scroll position

        const handleResize = () => setWindowWidth(window.innerWidth);

        const handleScroll = () => {
            const headerOuter = document.querySelector(".header-outer");
            const headerMenuCheckbox = headerOuter.querySelector(".header-menu input");

            // Detect scroll direction
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection("up");
            }

            headerOuter.classList.remove("active");
            headerMenuCheckbox.checked = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        setItems(cartItems);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className='header-outer' data-dir={scrollDirection}>
            <div className="container">
                <Link to={'/'} className='header-logo-container'>
                    <img src={windowWidth < 768 ? logoWhite : (isDarkMode ? logoWhite : Logo)} alt="logo" className='header-logo' />
                </Link>
                <div className="header-search">
                    <SearchIcon width={20} height={20} fill={windowWidth < 768 ? 'black' : (isDarkMode ? 'white' : 'black')} />
                    <input type="text" placeholder='Search...' />
                    <button className='search-btn'>
                        <span>Search</span>
                    </button>
                </div>
                <nav>
                    <div className="language-selection">
                        <span className='active' onClick={handleLanguage} data-lang="en">EN</span>
                        <span className='unactive' onClick={handleLanguage} data-lang="bn">বাং</span>
                    </div>
                    <div className="theme-toggle-btn header-button" onClick={toggleTheme}>
                        <ThemeToggleIcon />
                        <span className='button-content-mob'>Theme</span>
                    </div>
                    <Link to={"/cart"} className='header-button header-cart-btn'>
                        <CartIcon width={23} height={23} />
                        <span className={`${items ? 'active' : ''}`}>{items ? items.length : ''}</span>
                        <span className='button-content-mob'>Cart</span>
                    </Link>
                    <Link to={'/account'} className='header-button'>
                        <span>
                            <UserIcon width={23} />
                        </span>
                        <span className='button-content-mob'>Account</span>
                    </Link>
                    <div className="header-menu" onClick={handleNavMenuClick}>
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
                <div className="mobile-nav">
                    <Link to={'/'}>
                        <span>
                            <HomeIcon fill="white" />
                        </span>
                        <span>Home</span>
                    </Link>
                    <Link to={'/featured'}>
                        <span className='search-svg'>
                            <SearchIcon />
                        </span>
                        <span>Search</span>
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