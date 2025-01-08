import React, { useEffect, useState } from 'react'
import Product from './Product';
import '../styles/products.css'

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://dummyjson.com/products').then((res) => res.json()).then((data) => {
            setProducts(data.products);
        }).catch((error) => {
            console.error('Error fetching data: ', error);
        })
    }, []);
    return (
        <div className='products-container'>
            {products.map((product) => (
                <Product data={product} key={product.id} />
            ))}
        </div>
    )
}
