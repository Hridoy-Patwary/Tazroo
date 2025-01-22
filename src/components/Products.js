import React, { useEffect, useState } from 'react';
import Product from './Product';
import '../styles/products.css';

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/api/v1/product-list')
            .then((res) => res.json())
            .then((data) => setProducts(data)).catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <div className="products-container">
            {products.map((product) => (
                <Product data={product} key={product.id} />
            ))}
        </div>
    );
}