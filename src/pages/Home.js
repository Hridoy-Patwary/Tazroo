import React, { useEffect } from 'react'
import Products from '../components/Products'
import { ReactComponent as ShopIcon } from '../assets/vector/shopping.svg';
import '../styles/home.css'

export default function Home({ hdr }) {
    const categoryList = ['All', 'IT Accessories', 'Gaming', 'Electronics', 'Clothing'];
    
    const handleCategoryClick = (e) => {
        const categoryElm = e.target;
        const categoryList = categoryElm.parentElement;
        const oldCategoryActive = categoryList.querySelector('.active');

        if(oldCategoryActive) oldCategoryActive.classList.remove('active');
        categoryElm.classList.add('active');
    };

    useEffect(() => {
        hdr(true);
    }, [hdr]);
    return (
        <div className='home-container'>
            <div className="container">
                <div className="hero-area">
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
                <div className="custom-order-box">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque ullam eveniet, iure eos aut assumenda eius aperiam accusantium aliquam, numquam facilis animi nobis dolorum commodi provident reiciendis laboriosam recusandae voluptatibus itaque illum perspiciatis ad hic. Repellendus tempore amet consequatur assumenda, molestias laborum architecto et ipsum nulla iusto. Maiores, praesentium cupiditate.</div>
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