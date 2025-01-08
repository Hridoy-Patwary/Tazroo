import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import { ReactComponent as CartIcon } from '../assets/icons/cart normal.svg';
import '../styles/products.css'

export default function Product() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pid = queryParams.get('id');
    const [product, setProduct] = useState(null);

    const addToCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const itemsJSON = cartItems ? cartItems : [];
        const headerCartCounter = document.querySelector('.header-cart-btn span');

        itemsJSON.push(product);
        localStorage.setItem('cart', JSON.stringify(itemsJSON));
        headerCartCounter.classList.add('active');
        headerCartCounter.innerHTML = itemsJSON.length
    }


    useEffect(() => {
        if (pid) {
            fetch(`https://dummyjson.com/products/${pid}`)
                .then((response) => response.json())
                .then((data) => setProduct(data))
                .catch((error) => console.error('Error fetching product details:', error));
        }
    }, [pid]);

    if (!product) {
        return <div className='product-loading'>
            <LoadingSpinner />
        </div>;
    }
    return (
        <div className="product-page-container">
            <div className="product-image-container">
                <img src={product.thumbnail} className='product-image' alt={product.title} />
            </div>
            <div className="container">
                <div className="product-detail">
                    <h2>{product.title}</h2>
                    <p>Price: ${product.price}</p>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <button className="add-to-cart" onClick={addToCart}>
                        <CartIcon width={25} height={25} />
                    </button>
                </div>
            </div>
        </div>
    )
}