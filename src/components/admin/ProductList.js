import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../assets/icons/edit.svg';

export default function ProductList() {
    const navigate = useNavigate();
    const sortOptSelector = useRef();
    const [products, setProducts] = useState([]);

    const sortOptionHandler = () => {
        const selector = sortOptSelector.current;

        console.log(selector.value);
    }

    const editBtnHandler = (e) => {
        const itemRow = e.target.closest('.product-list-item');
        const id = itemRow.dataset.id;
        
        navigate(`?pg=add-product&pid=${id}`);
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/api/v1/product-list')
            .then((res) => res.json())
            .then((data) => setProducts(data)).catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }, []);
    return (
        <div className='product-list-page'>
            <div className="product-list-top df alic jstfy-btwn">
                <h3>Product Lists</h3>
                <div>
                    <span className='tertiary-color'>Sort by:</span>
                    <select name="sort" onChange={sortOptionHandler} ref={sortOptSelector}>
                        <option value="none">None</option>
                        <option value="a-to-z">A To Z</option>
                        <option value="z-to-a">Z To A</option>
                        <option value="date">Date</option>
                    </select>
                </div>
            </div>
            <div className="product-list-rows">
                {
                    products.map((product, i) => {
                        return <div className="product-list-item df" key={i} data-id={product.id}>
                            {/* <input type="checkbox" /> */}
                            <img src={process.env.REACT_APP_API_URL + '/' + product.images[0].filePath} alt="product" />
                            <div className="product-details">
                                <p className='secondary-color mb5'>{product.name}</p>
                                <small>Brand: {product.brand}</small>
                                <small>Model: {product.modelname}</small>
                                <div className="df alic gap10">
                                    <small>Discount Price: {product.dprice}</small>
                                    <small>Regular Price: {product.price}</small>
                                </div>
                            </div>
                            <button onClick={editBtnHandler}>
                                <EditIcon width={20} height={20} />
                            </button>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
