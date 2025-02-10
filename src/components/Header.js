import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Logo from '../assets/logo.png';
import logoWhite from '../assets/logo - white.png';
import { ThemeContext } from './ThemeToggle';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import { ReactComponent as ServicesIcon } from '../assets/icons/services.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import '../styles/default.css';
import '../styles/header.css';
import ThemeToggleIcon from './ThemeToggleIcon';
import LoadingSpinner from './LoadingSpinner';
import FilterBar from './FilterBar';

export default function Header({ prList }) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchBtn = useRef();
    const [items, setItems] = useState();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [srcRes, setsrcRes] = useState([]);
    const [pathLocation, setPathLocation] = useState('/account');
    const [scrollDirection, setScrollDirection] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeLink, setActiveLink] = useState('home');
    const overlayBgForSearch = useRef();
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

    const getThemeContent = () => {
        const themeContent = document.querySelector('meta[name="theme-color"]');
        const defaultThemeClr = themeContent.getAttribute('default');
        const nextThemeClr = themeContent.getAttribute('next');

        return {
            elm: themeContent,
            default: defaultThemeClr,
            next: nextThemeClr
        }
    }

    const themeChange = (colorCode) => {
        const themeContent = document.querySelector('meta[name="theme-color"]');
        themeContent.setAttribute('content', colorCode);
    }

    const themeHandler = () => {
        const themeElmData = getThemeContent();

        themeChange(theme === 'light' ? themeElmData.next : themeElmData.default);
        toggleTheme();
    }

    const handleNavMenuClick = (e) => {
        const headerOuter = e.target.closest('.header-outer');
        const headerMenuInp = headerOuter.querySelector('.header-menu input');

        if(headerOuter.classList.contains('active-bg') && e.target.tagName !== 'INPUT'){
            headerOuter.classList.remove('active-bg')
        }else{
            headerOuter.classList.remove('active-bg')
            headerOuter.classList.toggle('active');
            if (!headerOuter.classList.contains('active')) {
                headerMenuInp.checked = false
            }
        }
    }

    console.log('fix why its loading too many times');


    let typingTimeout = null;
    const searchInpHandler = (e) => {
        const headerOuter = overlayBgForSearch.current?.parentElement?.parentElement;
        const spinnerAndSearch = headerOuter.querySelector(".header-search-spinner-and-icon");
        spinnerAndSearch.classList.add('flip');

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            spinnerAndSearch.classList.remove("flip");
        }, 1000);

        if (e.target.value === '') {
            searchBtn.current.classList.add('unactive');
            overlayBgForSearch.current.classList.remove('active');
        } else {
            searchBtn.current.classList.remove('unactive');
            overlayBgForSearch.current.classList.add('active');
            const filterSearch = prList.filter((v) => v.name.toLowerCase().includes(e.target.value.toLowerCase()));
            setsrcRes(filterSearch);
        }
    };

    const searchInpInFocus = () => {
        const headerOuter = overlayBgForSearch.current.parentElement.parentElement;
        const headerMenuCheckbox = headerOuter.querySelector(".header-menu input");

        if (windowWidth > 768) return;
        themeChange(theme === 'light' ? 'color(srgb 0.1882 0.1882 0.1883)' : 'color(srgb 0.0471 0.0471 0.0471)');
        document.body.classList.add('no-scroll');
        headerOuter.classList.remove('active');
        headerMenuCheckbox.checked = false;
        headerOuter.classList.add('show-search');
    }

    const hideSearchWin = () => {
        const headerOuter = overlayBgForSearch.current.parentElement.parentElement;

        if (windowWidth > 768) return;
        const themeElmData = getThemeContent();

        themeChange(theme === 'light' ? themeElmData.default : themeElmData.next);
        overlayBgForSearch.current.classList.remove('active');
        document.body.classList.remove('no-scroll');
        headerOuter.classList.remove('show-search');
    }

    const searchHandler = () => {
        navigate('/search');
        hideSearchWin();
    }

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
    }

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const cartItems = JSON.parse(localStorage.getItem("cart"));
        let lastScrollY = window.scrollY;

        if (localStorage.getItem('ud')) setPathLocation('/profile');

        const handleScroll = () => {
            const headerOuter = document.querySelector(".header-outer");
            const headerMenuCheckbox = headerOuter.querySelector(".header-menu input");
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
        } else if (location.pathname === '/services') {
            setActiveLink('services');
        } else if (location.pathname === '/profile') {
            setActiveLink('account');
        }
        
        const pathList = ['product', 'account', 'cart', 'admin', 'services', 'profile'];
        const matched = pathList.find((path) => location.pathname.includes(path));
        if(matched){
            console.log(matched)
        }
    }, [location.pathname, theme]);

    return (
        <div className='header-outer' data-dir={scrollDirection}>
            <div className="container">
                <Link to={'/'} className='header-logo-container'>
                    {/* <img src={windowWidth < 768 ? logoWhite : (isDarkMode ? logoWhite : Logo)} alt="logo" className='header-logo' /> */}
                    <img src={isDarkMode ? logoWhite : Logo} alt="logo" className='header-logo' />
                </Link>
                <div className="header-search">
                    <div className="header-search-spinner-and-icon">
                        <LoadingSpinner />
                        <SearchIcon width={20} height={20} fill={windowWidth < 768 ? 'black' : (isDarkMode ? 'white' : 'black')} />
                    </div>
                    <input type="text" placeholder='Search...' onKeyUp={searchInpHandler} onFocus={searchInpInFocus} />
                    <button className='search-btn unactive' onClick={searchHandler} ref={searchBtn}>
                        <span>Search</span>
                    </button>
                </div>
                <div className="overlay-bg-for-search" ref={overlayBgForSearch} onClick={hideSearchWin}>
                    <div className="search-res-container">
                        {srcRes && srcRes.length > 0 ? <div className="custom-clr df alic jstfy-btwn">
                            <p>{srcRes && srcRes.length > 0 ? (srcRes.length + (srcRes.length > 1 ? ' results' : ' result') + ' in total') : ''}</p>
                            <Link to={'/search'}>More..</Link>
                        </div> : ''}

                        {
                            srcRes.length > 0 ? srcRes.map((src, i) => (
                                <Link key={i} to={`/product/${src.id}`} className='search-result'>
                                    <img src={process.env.REACT_APP_API_URL + '/' + src.images[0].filePath} width={80} height={80} alt="product" />
                                    <div className="df alic w100 oh">
                                        <div className="details df fdc">
                                            <p className='secondary-color'>{src.name}</p>
                                            <small className='tertiary-color'>Brand: <span>{src.brand}</span></small>
                                            <small className='tertiary-color'>Model: <span>{src.modelname}</span></small>
                                        </div>
                                        <h3 className="pr-color search-res-price">৳{src.dprice}</h3>
                                    </div>
                                </Link>
                            )) : ''
                        }
                    </div>
                </div>
                <nav>
                    <div className="mob-menu-bg" onClick={handleNavMenuClick}></div>
                    {/* this element is for nav background and used for tap to close nav */}
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
                    <Link to={pathLocation} className={`header-button${activeLink === 'account' ? ' active' : ''}`} onClick={() => handleLinkClick('account')}>
                        <span>
                            <UserIcon width={23} />
                        </span>
                        <span className='button-content-mob'>Account</span>
                    </Link>
                    <div className="theme-toggle-btn header-button" onClick={themeHandler}>
                        <ThemeToggleIcon />
                        <span className='button-content-mob'>{theme}</span>
                    </div>
                    <Link to={"/cart"} className={`header-button header-cart-btn${activeLink === 'cart' ? ' active' : ''}`} onClick={() => handleLinkClick('cart')}>
                        <CartIcon width={23} height={23} />
                        <span className={`${items && items.length > 0 ? 'active' : ''}`}>{items && items.length > 0 ? items.length : ''}</span>
                        <span className='button-content-mob'>Cart</span>
                    </Link>
                    <Link to={'/services'} className={`header-button services-header-menu${activeLink === 'services' ? ' active' : ''}`} onClick={() => handleLinkClick('services')}>
                        <span>
                            <ServicesIcon width={23} />
                        </span>
                        <span className='button-content-mob'>Services</span>
                    </Link>
                    <div className="mob-bottom-menus">
                        <Link to={'/feedback'} className='header-button' data-showmob="true">
                            <span className='button-content-mob'>Feedback</span>
                        </Link>
                        <Link to={'/contact-us'} className='header-button' data-showmob="true">
                            <span className='button-content-mob'>Chat with us</span>
                        </Link>
                    </div>
                    <div className="header-menu" onClick={handleNavMenuClick}>
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <FilterBar />
                </nav>
            </div>
        </div>
    );
}