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
        console.log(navigator);
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
                        return <div className="product-list-item df alic" key={i} data-id={product.id}>
                            <input type="checkbox" />
                            <p className='secondary-color'>{product.name}</p>
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
