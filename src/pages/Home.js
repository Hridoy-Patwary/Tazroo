import React from 'react'
import Products from '../components/Products'
import { ReactComponent as ShopIcon } from '../assets/vector/shopping.svg';
import '../styles/home.css'

export default function Home() {
    const categoryList = ['All', 'IT Accessories', 'Gaming', 'Electronics', 'Clothing'];
    
    const handleCategoryClick = (e) => {
        const categoryElm = e.target;
        const categoryList = categoryElm.parentElement;
        const oldCategoryActive = categoryList.querySelector('.active');

        if(oldCategoryActive) oldCategoryActive.classList.remove('active');
        categoryElm.classList.add('active');
    };
    return (
        <div className='home-container'>
            <div className="container">
                <div className="offer-slider-box">
                    <div className="offer-box">
                        <div className="box-content">
                            <h1>Get delivery within 30 minutes!</h1>
                            <p>We can delivery product to your dorsteps within 30 minutes, order now!</p>
                            <button className="shop-now">SHOP NOW!</button>
                        </div>
                        <ShopIcon />
                    </div>
                </div>
                <div className="category-bar">
                    <div className="content">
                        <h3>Featured categories</h3>
                        <p>Get Your Product from our Featured Category!</p>
                    </div>
                    <div className="category-list">
                        {categoryList.map((category, i) => (
                            <div key={category} className={`category${i === 0 ? ' active' : ''}`} onClick={(e) => handleCategoryClick(e)}>
                                <p>{category}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filter-bar"></div>
                <Products />
            </div>
        </div>
    )
}