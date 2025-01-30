import React from 'react';
import Product from './Product';
import '../styles/products.css';

export default function Products({ prList }) {
    return (
        <div className="products-container">
            {prList.map((product) => (
                <Product data={product} key={product.id} />
            ))}
        </div>
    );
}