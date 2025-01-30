import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg'
import { ReactComponent as WalletIcon } from '../assets/payment/wallet.svg'
import BkashLogo from '../assets/payment/bkash.png';
import NagadLogo from '../assets/payment/nagad.png';
import RocketLogo from '../assets/payment/rocket.jpeg';
import Footer from '../components/Footer';
import '../styles/cart.css';
import { Link, useNavigate } from 'react-router-dom';


const PaymentMethod = () => {
    const mobileBankRef = useRef();
    const addCardBox = useRef();
    const codRow = useRef();
    const useCardRow = useRef();
    const obj = {
        method: ''
    }

    const handleUseCard = (e) => {
        const checked = e.checked;

        if(checked){
            addCardBox.current.classList.add('show');
        }else{
            addCardBox.current.classList.remove('show');
        }
    }

    const handleCheckBox = (e) => {
        const t = e.current;
        const inp = t.querySelector('input');
        const checked = inp.checked;

        inp.checked = !checked;
        if(e === useCardRow){
            codRow.current.querySelector('input').checked = false;
            obj.method = 'Card';
            handleUseCard(inp);
        }else{
            const x = useCardRow.current.querySelector('input');
            x.checked = false;
            obj.method = 'COD';
            handleUseCard(x);
        }

        if(mobileBankRef.current.querySelector('.active')){
            const mobBank = mobileBankRef.current.querySelector('.active');
            mobBank.classList.remove('active');
        }
    }

    const mobileBankingPaymentHandler = (e) => {
        const t = e.target;
        const parent = t.parentElement;
        const oldActive = parent.querySelector('.active');
        const card = useCardRow.current.querySelector('input');

        codRow.current.querySelector('input').checked = false;
        card.checked = false;
        handleUseCard(card);

        if(oldActive) oldActive.classList.remove('active');
        t.classList.add('active');
        obj.method = t.title;
    }
    return <div className='payment-method-container'>
                <div className="df alic jstfy-e">
                    <h4 className='secondary-color'>Payment Method</h4>
                </div>
                <div className="pmnt-options-grid mb10" ref={mobileBankRef}>
                    <div className="pmnt-opt nagad" title='Bkash' onClick={mobileBankingPaymentHandler}>
                        <img src={BkashLogo} alt='logo' />
                    </div>
                    <div className="pmnt-opt bkash" title='Nagad' onClick={mobileBankingPaymentHandler}>
                        <img src={NagadLogo} alt="logo" />
                    </div>
                    <div className="pmnt-opt rocket" title='Rocket' onClick={mobileBankingPaymentHandler}>
                        <img src={RocketLogo} alt="logo" />
                    </div>
                </div>
                <div className="df alic gap5 jstfy-e mb10 use-card-instead cod-available c-pointer" ref={codRow} onClick={() => handleCheckBox(codRow)}>
                    <input type="checkbox" />
                    <span className='tertiary-color u_sel_none'>Cash On Delivery Availale!</span>
                </div>
                <div className="df alic gap5 jstfy-e mb10 use-card-instead c-pointer" ref={useCardRow} onClick={() => handleCheckBox(useCardRow)}>
                    <input type="checkbox" />
                    <span className='tertiary-color'>use card instead?</span>
                </div>
                <div className="pmnt-add-card" ref={addCardBox}>
                    <div className='df alic jstfy-e gap10 mb10'>
                        <span>
                            <WalletIcon width={20} height={20} />
                        </span>
                        <span className='tertiary-color'>Add credit or debit card</span>
                    </div>
                    <div className="df alic jstfy-e gap10">
                        <h2 className="hash tertiary-color">#</h2>
                        <input type="text" placeholder='Card number' />
                    </div>
                </div>
                <small className='tertiary-color mt10'>By continuing, you agree to the Tazroo Payment <Link to={'/termsofservice'} className='pr-color'>Terms of Service</Link>.</small>
            </div>
}



export default function Cart({ hdr }) {
    const [items, setItems] = useState();
    const [user, setUser] = useState();
    const [sbTotal, setSbTotal] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(30);
    const [location, setLocation] = useState(null);
    const navigate = useNavigate();
    const inTotal = useRef();
    const addrSelector = useRef();
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
        const totalPrice = target.parentElement.parentElement.querySelector('.total-price-span');
        const quantityValue = parseInt(quantityInp.value);
        const increaseOrDecrease = target.dataset.value;
        let updatedQuantity, subTotalPrice = 0;
        const minMax = { min: quantityInp.min, max: quantityInp.max };

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

        updatedItems.forEach((itm) => subTotalPrice += (itm.dprice ? itm.dprice : itm.prie) * itm.quantity);

        setSbTotal(subTotalPrice);
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

    const shippingAddrChangeHandler = () => {
        if(addrSelector.current.value === 'paltan, dhaka uttara'){
            setDeliveryFee(70);
        }else setDeliveryFee(30);
    }

    const checkoutHandler = (e) => {
        const tr = e.target;
        if(tr.classList.contains('loading')) return;

        tr.classList.add('loading');
        if(user){

        }else navigate('/account');
    }

    if (location) alert(location.lat + ' ' + location.long)

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const udFromLocal = localStorage.getItem('ud');
        let total = 0;
        
        if(cartItems) cartItems.forEach((itm) => total += (itm.dprice ? itm.dprice : itm.prie) * itm.quantity);
        // if (udFromLocal === 'undefined' || !udFromLocal) navigate('/account');
        const data = JSON.parse(udFromLocal);

        setSbTotal(total);
        setItems(cartItems);
        setUser(data);
        hdr(true);
    }, [hdr, navigate])

    return (
        <>
            <div className='cart-container'>
                <div className="container">
                    <div className="t-center mb20">
                        <h2 className='cart-heading'>Your Cart</h2>
                        {items && items.length > 0 ? (
                            <>
                                <span className='tertiary-color'>{items.length} {items.length > 1 ? 'items' : 'item'}</span>
                            </>
                        ) : ''}
                    </div>
                    <div className="cart-list-container">
                        <div className="cart-list">
                            {
                                items && items.length !== 0 ? items.map((item, i) => (
                                    <div className="cart-item" key={i} data-id={item.id}>
                                        <div className="item-img-and-details">
                                            <img src={process.env.REACT_APP_API_URL + '/' + item.images[0].filePath} width={80} alt="" />
                                            <div className="details">
                                                <p>{item.name}</p>
                                                <div className='dg'>
                                                    <small>{item.modelname ? ('Model: ' + item.modelname) : ''}</small>
                                                    <small className='warranty-text'>{item.warranty ? 'Warranty: ' : ''}{warrantyMapping[item.warranty] || 'No Warranty'}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-small-details">
                                            <div className="item-prices">
                                                <div className="price">
                                                    <span>৳{item.dprice ? item.dprice : item.price}</span>
                                                </div>
                                                <div className="price-total tertiary-color"><span>{item.quantity}</span> &times; ৳<span className='total-price-span'>{parseInt(item.quantity) * (item.dprice ? item.dprice : item.price)}</span></div>
                                            </div>
                                            <div className="quantity">
                                                <button onClick={quantityHandler} data-value="decrease">-</button>
                                                <input type="number" min={1} max={10} value={item.quantity} readOnly />
                                                <button onClick={quantityHandler} data-value="increase">+</button>
                                            </div>
                                            <button onClick={itemDeleteHandler} className='cart-delete-item' title='Delete'>
                                                <TrashIcon width={24} height={24} />
                                            </button>
                                        </div>
                                    </div>
                                )) : <div className="t-center">
                                    <span className='tertiary-color'>No items added</span>
                                </div>
                            }
                        </div>
                        {
                            items && items.length !== 0 ? <div className="cart-list-checkout-box">
                                                            <div className="shipping-address">
                                                                <p className="tertiary-color">Shipping Address</p>
                                                                <select name="location" className='shipping-addr-select' onChange={shippingAddrChangeHandler} ref={addrSelector}>
                                                                    {
                                                                        user && user.address ?
                                                                            user.address.map((addr, i) => {
                                                                                return <option value={addr.address} key={i}>{addr.address}</option>
                                                                            })
                                                                        : <option value="add">Create account to add address</option>
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="order-summery">
                                                                <p><span className='tertiary-color'>Sub Total:</span> <span>৳{sbTotal}</span></p>
                                                                <p><span className='tertiary-color'>Delivery Fee:</span> <span>৳{deliveryFee}</span></p>
                                                                <p className='checkout-total'><span className='secondary-color'>Total:</span> <span ref={inTotal}>৳{deliveryFee+sbTotal}</span></p>
                                                            </div>
                                                            <PaymentMethod />
                                                            <div className="t-center">
                                                                <button className="proceed-checkout sign-anim-btn" onClick={checkoutHandler}>Checkout</button>
                                                            </div>
                                                        </div> : ''
                        }
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