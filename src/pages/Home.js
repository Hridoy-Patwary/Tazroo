import React, { useEffect, useRef } from 'react'
import Products from '../components/Products'
import { ReactComponent as ShopIcon } from '../assets/vector/shopping.svg';
import { ReactComponent as FilterIcon } from '../assets/icons/filter.svg';
import { ReactComponent as GridViewIcon } from '../assets/icons/grid-view.svg';
import { ReactComponent as ListViewIcon } from '../assets/icons/list-view.svg';
import Footer from '../components/Footer';
import '../styles/home.css'

export default function Home({ hdr, prList }) {
    const sliderPos = useRef();
    const sliderTrackDiv = useRef();
    const categoryList = ['All', 'IT Accessories', 'Gaming', 'Electronics', 'Clothing'];

    const handleCategoryClick = (e) => {
        const categoryElm = e.target;
        const categoryList = categoryElm.parentElement;
        const oldCategoryActive = categoryList.querySelector('.active');

        if (oldCategoryActive) oldCategoryActive.classList.remove('active');
        categoryElm.classList.add('active');
    };

    const handleCustomOrderBtnClick = () => {
        console.log('hello from custom order btn')
    }

    const viewClickHandler = (e) => {
        const tr = e.target;
        const parent = tr.parentElement;
        const productListContainer = document.querySelector('.products-container');
        const oldAct = parent.querySelector('.active');

        oldAct.classList.remove('active');
        tr.classList.add('active');

        if(tr.dataset.view === 'list'){
            productListContainer.classList.add('list-view');
        }else if(tr.dataset.view === 'grid'){
            productListContainer.classList.remove('list-view');
        }
    }

    const filterHandler = () => {
        const headerOuter = document.querySelector('.header-outer');

        headerOuter.classList.add('active-bg');
        console.log('handle filter')
    }

    useEffect(() => {
        let currentIndex = 1;
        const sliderTrack = sliderTrackDiv.current;
        const slides = Array.from(sliderTrack.querySelectorAll('.offer-box'));

        // Clone the first and last slides
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        sliderTrack.appendChild(firstClone);
        sliderTrack.insertBefore(lastClone, slides[0]);

        sliderTrack.style.transform = `translateX(-${currentIndex}00%)`;

        sliderPos.current.innerHTML = '';
        for (let i = 0; i < sliderTrack.querySelectorAll('.offer-box').length; i++) {
            const sliderPosElm = document.createElement('span');
            if (i === currentIndex) {
                sliderPosElm.className = 'active';
            }
            sliderPos.current.appendChild(sliderPosElm);
        }

        const moveSlider = () => {
            const activeSliderPos = sliderPos.current.querySelector('.active');
            currentIndex++;
            sliderTrack.style.transition = 'transform 1s ease-in-out';
            sliderTrack.style.transform = `translateX(-${currentIndex}00%)`;
            if (activeSliderPos) activeSliderPos.classList.remove('active');
            sliderPos.current.children[currentIndex].classList.add('active');

            sliderTrack.addEventListener('transitionend', () => {
                if (currentIndex === slides.length + 1) {
                    currentIndex = 1;
                    sliderTrack.style.transition = 'none';
                    sliderTrack.style.transform = `translateX(-${currentIndex}00%)`;
                }
            });
        };

        const sliderInterval = setInterval(moveSlider, 5000);

        hdr(true);
        return () => {
            clearInterval(sliderInterval);
        };
    }, [hdr]);
    return (
        <>
            <div className='home-container'>
                <div className="container">
                    <div className="hero-area">
                        <div className="offer-slider-box">
                            <div className="offer-slide-track" ref={sliderTrackDiv}>
                                <div className="offer-box">
                                    <div className="box-content">
                                        <h1>Get delivery within 30 minutes!</h1>
                                        <p>We can delivery product to your dorsteps within 30 minutes, order now!</p>
                                        <button className="shop-now">SHOP NOW!</button>
                                    </div>
                                    <ShopIcon />
                                </div>
                                <div className="offer-box custom-order-slide">
                                    <div className="box-content">
                                        <h1>You can place order for anything!</h1>
                                        <p>Use "Custom Order" feature to order anything that isn't listed on our site and we'll delivery it to your doorstep within 30 minutes!</p>
                                        <button className="shop-now">CUSTOM ORDER</button>
                                    </div>
                                </div>
                                <div className="offer-box discount-and-offer">
                                    <div className="box-content">
                                        <h1>Create account to get exciting discounts!</h1>
                                        <p>You'll be able to create account to get products with discount and you'll be notified of there's any offer going on.</p>
                                        <button className="shop-now">Create Account</button>
                                    </div>
                                </div>
                                <div className="offer-box certified-products">
                                    <div className="box-content">
                                        <h1>Checkout our Certified Products!</h1>
                                        <p>We're excited to announce Certified Products by Tazroo, all certified products were checked and tested carefully before adding to our platform.</p>
                                        <button className="shop-now">Checkout!</button>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-position-display" ref={sliderPos}></div>
                        </div>
                        <div className="custom-order-box">
                            <div></div>
                            <div className="t-center">
                                <button className='custom-order-btn' onClick={handleCustomOrderBtnClick}>Custom Order!</button>
                            </div>
                        </div>
                    </div>
                    <div className="category-bar">
                        <div className="content">
                            <h3>Featured categories</h3>
                            <p className='tertiary-color'>Get Your Product from our Featured Category!</p>
                        </div>
                        <div className="category-sort-filter-bar df alic jstfy-btwn gap10">
                            <div className="category-list">
                                {categoryList.map((category, i) => (
                                    <div key={category} className={`category${i === 0 ? ' active' : ''}`} onClick={(e) => handleCategoryClick(e)}>
                                        <p>{category}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="sort-filter-container df alic gap10">
                                <div className="view-option opts alic gap5">
                                    <span className='title'>View: </span>
                                    <div className="grid-and-list-view df">
                                        <span className='icon active' onClick={viewClickHandler} data-view="grid">
                                            <GridViewIcon width={20} height={20} />
                                        </span>
                                        <span className='icon' onClick={viewClickHandler} data-view="list">
                                            <ListViewIcon width={20} height={20} />
                                        </span>
                                    </div>
                                </div>
                                <div className="filter-option opts df alic gap5" onClick={filterHandler}>
                                    <span className='title'>Filter: </span>
                                    <span className='icon'>
                                        <FilterIcon width={20} height={20} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="filter-bar"></div>
                    <Products prList={prList} />
                </div>
            </div>
            <Footer />
        </>
    )
}