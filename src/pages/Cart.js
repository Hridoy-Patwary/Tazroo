import React, { useEffect, useState } from 'react'
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg'
import Footer from '../components/Footer';
import '../styles/cart.css';

export default function Cart({ hdr }) {
    const [items, setItems] = useState();
    const [location, setLocation] = useState(null);
    const warrantyMapping = {
        'sd': 'Same Day',
        '3mnth': '3 Months',
        '6mnth': '6 Months',
        '1yr': '1 Year',
        '2yr': '2 Years',
        '3yr': '3 Years'
    };


    const getLocationData = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const long = pos.coords.longitude;
                setLocation({ lat, long });
            }, (error) => {
                console.log(error);
            })
        }
    }

    const quantityHandler = (e) => {
        const target = e.target;
        const id = target.closest('.cart-item').dataset.id;
        const quantityInp = target.parentElement.querySelector('input');
        const productItem = items.find(product => product.id === id);
        const price = productItem.dprice ? productItem.dprice : productItem.price;
        const totalPrice = target.parentElement.nextElementSibling.children[0];
        const quantityValue = parseInt(quantityInp.value);
        const increaseOrDecrease = target.dataset.value;
        const minMax = {
            min: quantityInp.min,
            max: quantityInp.max
        }
        let updatedQuantity;

        if (increaseOrDecrease === 'increase') {
            updatedQuantity = quantityValue + 1;
            quantityInp.value = updatedQuantity > minMax.max ? minMax.max : updatedQuantity;
        } else {
            updatedQuantity = quantityValue - 1;
            quantityInp.value = updatedQuantity < minMax.min ? minMax.min : updatedQuantity;
        }

        const updatedItems = items.map(item =>
            item.id === id ? { ...item, quantity: parseInt(quantityInp.value) } : item
        );

        setItems(updatedItems);
        totalPrice.innerHTML = price * parseInt(quantityInp.value);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    }

    const itemDeleteHandler = (e) => {
        const id = e.target.closest('.cart-item').dataset.id;
        const updatedItems = items.filter(item => item.id !== id);

        setItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    }

    if (location) alert(location.lat + ' ' + location.long)

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        setItems(cartItems);
        hdr(true);
    }, [hdr])

    return (
        <>
            <div className='cart-container'>
                <div className="container">
                    <h2 className='cart-heading'>Your Cart {items && items.length > 0 ? (
                        <>
                            (<span>{items.length}</span> {items.length > 1 ? 'items' : 'item'})
                        </>
                    ) : ''}</h2>
                    <div className="cart-list-container">
                        <div className="cart-list">
                            {
                                items ? items.map((item, i) => (
                                    <div className="cart-item" key={i} data-id={item.id}>
                                        <div className="item-img-and-details">
                                            <img src={process.env.REACT_APP_API_URL + '/' + item.images[0].filePath} width={80} alt="" />
                                            <div className="details">
                                                <p>{item.name.slice(0, 30) + '...'}</p>
                                                <small>{item.warranty ? 'Warranty: ' : ''}{warrantyMapping[item.warranty] || 'No Warranty'}</small>
                                            </div>
                                        </div>
                                        <div className="item-small-details">
                                            <div className="price">
                                                <span>৳{item.dprice ? item.dprice : item.price}</span>
                                            </div>
                                            <div className="quantity">
                                                <button onClick={quantityHandler} data-value="decrease">-</button>
                                                <input type="number" min={1} max={10} value={item.quantity} readOnly />
                                                <button onClick={quantityHandler} data-value="increase">+</button>
                                            </div>
                                            <div className="price-total">৳<span>{parseInt(item.quantity) * (item.dprice ? item.dprice : item.price)}</span></div>
                                            <button onClick={itemDeleteHandler} className='cart-delete-item' title='Delete'>
                                                <TrashIcon width={24} height={24} />
                                            </button>
                                        </div>
                                    </div>
                                )) : ''
                            }
                        </div>
                    </div>
                </div>
                <div className="t-center">
                    <button onClick={getLocationData}>Get location</button>
                </div>
            </div>
            <Footer />
        </>
    )
}