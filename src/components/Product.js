import React from 'react'
import { Link } from 'react-router-dom';

export default function Product(props) {
    return (
        <Link to={`/product?id=${props.data.id}`} data-pid={props.data.id} className='product-box'>
            <img src={props.data.thumbnail} alt={props.data.title} className='product-img' />
            <div className="product-content">
                <p className='product-title'>{props.data.title}</p>
                <p className='product-price'>${props.data.price}</p>
            </div>
        </Link>
    )
}