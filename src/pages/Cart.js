import React, { useEffect, useState } from 'react'
import '../styles/cart.css';

export default function Cart() {
    const [items, setItems] = useState();
    const [location, setLocation] = useState(null);


    const getLocationData = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const long = pos.coords.longitude;
                setLocation({ lat, long });
            }, (error) => {
                console.log(error);
            })
        }
    }

    if(location) alert(location.lat +' '+ location.long)

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        setItems(cartItems);
    }, [])
    
    return (
        <div className='cart-container'>
            <div className="container">
                <button onClick={getLocationData}>Get location</button>
                <h2 className='cart-heading'>Your Cart (<span>{items ? items.length : 0}</span> items)</h2>
                <div className="cart-list-container">
                    <div className="cart-list-heading">
                        <span>Item</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>
                    <div className="cart-list">
                        {
                            items ? items.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <div className="item-img-and-details">
                                        <img src={item.thumbnail} width={80} alt="" />
                                        <div className="details">
                                            <p>{item.title}</p>
                                            <small>{item.warrantyInformation}</small><br/>
                                            <small>{item.sku}</small>
                                        </div>
                                    </div>
                                    <div className="price">
                                        <span>{item.price}</span>
                                    </div>
                                    <div className="quantity"></div>
                                    <div className="price-total"></div>
                                </div>
                            )) : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
