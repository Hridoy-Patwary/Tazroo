import React from 'react';
import Product from './Product';
import '../styles/products.css';

export default function Products({ prList }) {
    let tmpProducts = [];
    if(prList.length === 0){
        for (let i = 0; i < 10; i++) {
            tmpProducts.push({
                id: i,
                name: i,
                model: i,
                description: i,
                dprice: i,
                price: i,
                images: []
            })
        }
    }

    return (
        <div className="products-container">
            {
                prList.length === 0 ? 
                    tmpProducts.map((product) => (
                        <Product data={product} ddata={true} key={product.id} />
                    )) : prList.map((product) => (
                        <Product data={product} ddata={false} key={product.id} />
                    ))
            }
        </div>
    );
}