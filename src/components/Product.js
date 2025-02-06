import React, { useEffect, useState } from 'react';
import { ReactComponent as WishListIcon } from '../assets/icons/wishlist.svg';
import { Link } from 'react-router-dom';

export default function Product(props) {
    const [wishListed, setWishListed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const addToWishList = async (e) => {
        e.preventDefault();
        const tr = e.target;
        const parent = tr.closest('.product-box');
        const id = parent.dataset.pid;
        const wishlistFromLocalDb = localStorage.getItem('wishlist');
        const wishlist = wishlistFromLocalDb ? JSON.parse(wishlistFromLocalDb) : [];
        const filtered = wishlist.find((v) => v.id === id);
        let obj = {
            id: id
        };

        if(parent.classList.contains('wishlisted') || tr.classList.contains('active')){
            const x = wishlist.filter(v => v.id !== id);
            parent.classList.remove('wishlisted');
            tr.classList.remove('active');
            localStorage.setItem('wishlist', JSON.stringify(x));
        }else if(!filtered){
            tr.classList.add('active');
            await fetch(process.env.REACT_APP_API_URL + '/api/v1/product/details', {
                method: 'post',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ id: id })
            }).then((res) => res.json()).then((data) => {
                if(data.id) obj = data;
            }).catch((err) => {
                console.log(err);
            });

            wishlist.push(obj);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }

    useEffect(() => {
        if(props.ddata) return;
        const img = new Image();
        const src = props.data.images ? process.env.REACT_APP_API_URL + '/' + props.data.images[0].filePath : '';
        const wishlistFromLocalDb = localStorage.getItem('wishlist');
        const wishlist = wishlistFromLocalDb ? JSON.parse(wishlistFromLocalDb) : [];
        const found = wishlist.find((v) => v.id === props.data.id);

        
        img.onload = () => {
            // console.log('Image loaded, applying artificial delay');
            setTimeout(() => {
                // console.log('finished');
                setImageSrc(src);
                setImageLoaded(true);
            }, 2000);
        };
        
        img.onerror = () => {
            console.log('Error loading image');
        };
        
        img.src = src;
        setWishListed(found ? true : false);
    }, [props.data.images, props.data.id, props.ddata]);

    return (
        <Link to={`/product/${props.data.id}`} data-pid={props.data.id} className={`product-box${imageLoaded ? '' : ' loading-product-image'}${wishListed ? ' wishlisted' : ''}`}>
            <div className="product-img-container">
                {imageLoaded ? <img 
                        src={imageSrc} 
                        alt={props.data.name} 
                        className='product-img' 
                    /> : ''}
            </div>
            <div className="product-content">
                <p className='product-title'>{props.data.name}</p>
                <div className="product-prices">
                    <p className='product-price discount-price'>৳{props.data.dprice}</p>
                    <p className='product-price old-price'><small>৳{props.data.price}</small></p>
                </div>
            </div>
            <div className="wishlist-btn" title='Add to wishlist' onClick={addToWishList}>
                <WishListIcon width={23} height={23} />
            </div>
        </Link>
    );
}