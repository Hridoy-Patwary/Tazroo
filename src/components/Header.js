import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
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
    const navigate = useNavigate();
    const location = useLocation(); // Access current location
    const [search, setSearch] = useState();
    const [items, setItems] = useState();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [pathLocation, setPathLocation] = useState('/account');
    const [scrollDirection, setScrollDirection] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeLink, setActiveLink] = useState('home'); // New state for active link
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
        const headerMenuInp = headerOuter.querySelector('.header-menu input');
        
        headerOuter.classList.toggle('active');
        if(!headerOuter.classList.contains('active')){
            headerMenuInp.checked = false
        }
    }

    const searchInpHandler = (e) => {
        if(e.keyCode === 13){
            alert(search);
        }else{
            setSearch(e.target.value);
        }
    }

    const searchHandler = () => {
        navigate('/search');
    }

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName); // Set the active link
    }

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const cartItems = JSON.parse(localStorage.getItem("cart"));
        let lastScrollY = window.scrollY;

        if (localStorage.getItem('ud')) setPathLocation('/profile');

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

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveLink('home');
        } else if (location.pathname === '/cart') {
            setActiveLink('cart');
        } else if (location.pathname === '/profile') {
            setActiveLink('account');
        }
    }, [location.pathname]);

    return (
        <div className='header-outer' data-dir={scrollDirection}>
            <div className="container">
                <Link to={'/'} className='header-logo-container'>
                    <img src={windowWidth < 768 ? logoWhite : (isDarkMode ? logoWhite : Logo)} alt="logo" className='header-logo' />
                </Link>
                <div className="header-search">
                    <SearchIcon width={20} height={20} fill={windowWidth < 768 ? 'black' : (isDarkMode ? 'white' : 'black')} />
                    <input type="text" placeholder='Search...' onKeyUp={searchInpHandler} />
                    <button className='search-btn' onClick={searchHandler}>
                        <span>Search</span>
                    </button>
                </div>
                <nav>
                    <div className='mob-menu-bg' onClick={handleNavMenuClick}></div>
                    <div className="language-selection">
                        <span className='active' onClick={handleLanguage} data-lang="en">EN</span>
                        <span className='unactive' onClick={handleLanguage} data-lang="bn">বাং</span>
                    </div>
                    <Link to={'/'} className={`header-button${activeLink === 'home' ? ' active' : ''}`} data-showmob="true" onClick={() => handleLinkClick('home')}>
                        <span>
                            <HomeIcon width={23} height={23} fill="rgb(166, 166, 166)" />
                        </span>
                        <span className='button-content-mob'>Home</span>
                    </Link>
                    <div className="theme-toggle-btn header-button" onClick={toggleTheme}>
                        <ThemeToggleIcon />
                        <span className='button-content-mob'>{theme}</span>
                    </div>
                    <Link to={"/cart"} className={`header-button header-cart-btn${activeLink === 'cart' ? ' active' : ''}`} onClick={() => handleLinkClick('cart')}>
                        <CartIcon width={23} height={23} />
                        <span className={`${items ? 'active' : ''}`}>{items ? items.length : ''}</span>
                        <span className='button-content-mob'>Cart</span>
                    </Link>
                    <Link to={pathLocation} className={`header-button${activeLink === 'account' ? ' active' : ''}`} onClick={() => handleLinkClick('account')}>
                        <span>
                            <UserIcon width={23} />
                        </span>
                        <span className='button-content-mob'>Account</span>
                    </Link>
                    <div className="mob-bottom-menus">
                        <Link to={'/privacy-policy'} className='header-button' data-showmob="true">
                            <span>
                                <UserIcon width={23} />
                            </span>
                            <span className='button-content-mob'>Privacy Policy</span>
                        </Link>
                        <Link to={'/feedback'} className='header-button' data-showmob="true">
                            <span>
                                <UserIcon width={23} />
                            </span>
                            <span className='button-content-mob'>Feedback</span>
                        </Link>
                        <Link to={'/contact-us'} className='header-button' data-showmob="true">
                            <span>
                                <UserIcon width={23} />
                            </span>
                            <span className='button-content-mob'>Chat with us</span>
                        </Link>
                    </div>
                    <div className="header-menu" onClick={handleNavMenuClick}>
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
            </div>
        </div>
    );
}