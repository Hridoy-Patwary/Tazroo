import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Product(props) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const img = new Image();
        const src = props.data.images ? process.env.REACT_APP_API_URL + '/' + props.data.images[0].filePath : '';

        img.onload = () => {
            console.log('Image loaded, applying artificial delay');
            setTimeout(() => {
                console.log('finished');
                setImageSrc(src);
                setImageLoaded(true);
            }, 2000);
        };

        img.onerror = () => {
            console.log('Error loading image');
        };

        img.src = src;
    }, [props.data.images]);

    return (
        <Link to={`/product/${props.data.id}`} data-pid={props.data.id} className={`product-box${imageLoaded ? '' : ' loading-product-image'}`}>
            <div className="product-img-container">
                {imageLoaded ? <img 
                        src={imageSrc} 
                        alt={props.data.name} 
                        className='product-img' 
                    /> : ''}
            </div>
            <div className="product-content">
                <p className='product-title'>{props.data.name.slice(0, 30) + '...'}</p>
                <div className="product-prices">
                    <p className='product-price discount-price'>৳{props.data.dprice}</p>
                    <p className='product-price old-price'><small>৳{props.data.price}</small></p>
                </div>
            </div>
        </Link>
    );
}