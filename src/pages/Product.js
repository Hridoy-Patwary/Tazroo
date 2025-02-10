import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer'
import { ReactComponent as CartIcon } from '../assets/icons/cart normal.svg';
import { ReactComponent as CartPageIcon } from '../assets/icons/cart.svg';
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg';
import '../styles/products.css'
import Products from '../components/Products';

export default function Product({ hdr, prList }) {
    const { id } = useParams();
    const descRef = useRef(null);
    const location = useLocation();
    const navigation = useNavigate();
    const [items, setItems] = useState();
    const [product, setProduct] = useState(null);
    const [truncatedText, setTruncatedText] = useState('');
    const pathnames = location.pathname.split('/').filter(x => x);
    const to = `/${pathnames[0]}/${pathnames[1]}`;

    const mappings = {
        warrantyMapping: {
            'sd': 'Same Day',
            '3mnth': '3 Months',
            '6mnth': '6 Months',
            '1yr': '1 Year',
            '2yr': '2 Years',
            '3yr': '3 Years'
        },
        categoryMapping: {
            'it': 'IT Accessories',
            'elc': 'Electronics',
            'clo': 'Cloathing'
        }
    };

    const addToCart = (e) => {
        const headerCartCounter = document.querySelector('.header-cart-btn span');
        const id = e.target.closest('.product-detail').dataset.id;
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const itemsJSON = cartItems ? cartItems : [];
        const found = itemsJSON.findIndex((item) => item.id === id);
        const updatedItems = itemsJSON.map(item =>
            item.id === id ? { ...item, quantity: item.quantity ? (parseInt(item.quantity) + 1) : 1 } : item
        );

        if (found === -1) {
            product.quantity = 1;
            itemsJSON.push(product);
            setItems(itemsJSON);
            localStorage.setItem('cart', JSON.stringify(itemsJSON));
        } else {
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        }
        headerCartCounter.classList.add('active');
        headerCartCounter.innerHTML = itemsJSON.length
    }

    // =================== EQUI js start =================== //
    const viewableImgContainer = useRef(null);
    const drgblImgContainerInner = useRef(null);
    const leftViewDragableBar = useRef(null);

    let sliderCount = useRef(0), selectBarBoxesSize = useRef(null), selectBarTransformPX = useRef(0);


    const selectNextAndPrev = (e) => {
        const beforeSelectedBox = document.querySelector(".left-view-draggable-bar .draggable-img.selected");
        const direction = e && e.dataset && e.dataset.select ? e.dataset.select : e.target.dataset.select;

        if (e && direction === "prev" && beforeSelectedBox.previousElementSibling !== null) {
            beforeSelectedBox.classList.remove("selected");
            beforeSelectedBox.previousElementSibling.classList.add("selected");
            viewerImgSlider("prev");
            if (sliderCount.current < (drgblImgContainerInner.current.childElementCount - 2)) {
                selectBarTransformPX.current = selectBarTransformPX.current - selectBarBoxesSize.current;
                if (selectBarTransformPX.current < 0) {
                    selectBarTransformPX.current = 0;
                }
                selectBarTransform();
            }
        } else if (e && direction === "next" && beforeSelectedBox.nextElementSibling !== null) {
            beforeSelectedBox.classList.remove("selected");
            beforeSelectedBox.nextElementSibling.classList.add("selected");
            viewerImgSlider("next");
            if (sliderCount.current > 2 && sliderCount.current !== (drgblImgContainerInner.current.childElementCount - 1)) {
                selectBarTransformPX.current = selectBarTransformPX.current + selectBarBoxesSize.current;
                selectBarTransform();
            }
        }
    }

    function selectBarTransform() {
        drgblImgContainerInner.current.style.transform = `translate3d(0px, -${selectBarTransformPX.current}px, 0px)`;
    }

    const prImages = document.querySelectorAll(".product-img--main");
    prImages.forEach((productImage) => {
        if (window.innerWidth < 768) return;
        productImage.addEventListener("mousemove", function (e) {
            const XY = {
                x: ((e.pageX - viewableImgContainer.current.offsetLeft) / this.offsetWidth) * 100,
                y: ((e.pageY - viewableImgContainer.current.offsetTop) / this.offsetHeight) * 100
            };
            productImage.style.transformOrigin = XY.x + "%" + XY.y + "%";
        })
    });

    const gotoCartPage = () => {
        navigation('/cart');
    }

    const viewerImgSlider = (slide) => {
        if (!viewableImgContainer.current) {
            console.log("viewableImgContainer is not defined");
            return;
        }

        if (slide === "prev") {
            sliderCount.current = sliderCount.current - 1;
            viewableImgContainer.current.style.transform = `translate3d(-${sliderCount.current}00%, 0px, 0px)`;
        } else if (slide === "next") {
            sliderCount.current = sliderCount.current + 1;
            viewableImgContainer.current.style.transform = `translate3d(-${sliderCount.current}00%, 0px, 0px)`;
        } else {
            viewableImgContainer.current.style.transform = `translate3d(-${sliderCount.current}00%, 0px, 0px)`;
        }
    }

    const quantityHandler = (e) => {
        const target = e.target;
        const quantityInp = target.parentElement.querySelector('input');
        const quantityValue = parseInt(quantityInp.value);
        const increaseOrDecrease = target.dataset.value;
        let updatedQuantity;
        const minMax = { min: quantityInp.min, max: quantityInp.max };

        if (increaseOrDecrease === 'increase') {
            updatedQuantity = quantityValue + 1;
            quantityInp.value = updatedQuantity > minMax.max ? minMax.max : updatedQuantity;
        } else {
            updatedQuantity = quantityValue - 1;
            quantityInp.value = updatedQuantity < minMax.min ? minMax.min : updatedQuantity;
        }
    }

    const selectColorHandler = (e) => {
        const tr = e.target;
        const parent = tr.parentElement;
        const oldActive = parent.querySelector('.active');

        if(oldActive) oldActive.classList.remove('active');
        tr.classList.add('active');
    }

    const seeMoreHandler = (e) => {
        const tr = e.target;
        descRef.current.classList.toggle('hide');

        if (descRef.current.classList.contains('hide')) {
            const parent = descRef.current.querySelector('p');
            descRef.current.style.height = parent.clientHeight + 'px';
            tr.innerHTML = 'See less...';
        } else {
            const parent = descRef.current.querySelector('p');
            const computedStyle = window.getComputedStyle(parent);
            const lineHeight = computedStyle.lineHeight;
            descRef.current.style.height = parseInt(lineHeight) * 4 + 'px';
            tr.innerHTML = 'See more...';
        }
    }

    const shareBtnClickHandler = () => {
        alert('this product will be able to view from a link');
    }


    useEffect(() => {
        if (id) {
            fetch(process.env.REACT_APP_API_URL + '/api/v1/product/details', {
                method: 'post',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ id: id })
            }).then((response) => response.json())
                .then((data) => setProduct(data))
                .catch((error) => console.error('Error fetching product details:', error));
        }

        const cartItems = JSON.parse(localStorage.getItem('cart'));

        setItems(cartItems);
    }, [id]);

    useEffect(() => {
        if (!product || !leftViewDragableBar.current || !drgblImgContainerInner.current) return;
        selectBarBoxesSize.current = drgblImgContainerInner.current.offsetHeight / drgblImgContainerInner.current.childElementCount;
        const allImgViewBarBoxes = leftViewDragableBar.current.querySelectorAll(".draggable-img");

        allImgViewBarBoxes.forEach((imgBox) => {
            imgBox.addEventListener("click", () => {
                if (!imgBox.classList.contains("selected")) {
                    sliderCount.current = [...allImgViewBarBoxes].indexOf(imgBox);
                    const beforeSelectedBox = document.querySelector(".left-view-draggable-bar .draggable-img.selected");
                    beforeSelectedBox.classList.remove("selected");
                    imgBox.classList.add("selected");
                    if (sliderCount.current > 2 && sliderCount.current !== drgblImgContainerInner.current.childElementCount - 1) {
                        selectBarTransformPX.current = selectBarBoxesSize.current * (sliderCount.current - 2);
                        selectBarTransform();
                    } else {
                        selectBarTransformPX.current = 0;
                    }

                    viewerImgSlider();
                }
            })
        });

        const seeMoreBtn = descRef.current.nextElementSibling;
        const descContainer = descRef.current.querySelector('p');
        const computedStyle = window.getComputedStyle(descContainer);
        const lineHeight = computedStyle.lineHeight;

        descRef.current.style.height = parseInt(lineHeight) * 4 + 'px';
        setTruncatedText(product.description);
        seeMoreBtn.innerHTML = 'See more...';

        hdr(true);
        return () => {
            allImgViewBarBoxes.forEach((imgBox) => {
                imgBox.replaceWith(imgBox.cloneNode(true));
            });
        };
    }, [product, hdr, selectBarBoxesSize])

    if (!product) {
        return <div className='product-loading'>
            <LoadingSpinner />
        </div>;
    }
    return (
        <>
            <div className="product-page-container">
                <div className="container">
                    <div className='breadcrumb'>
                        <Link to={'/'}>Home</Link>
                        <span>/</span>
                        <Link to={to}>{pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1)}</Link>
                        <span>/</span>
                        <Link className='breadcrumb-current' to={to + '/' + product.id}>{pathnames[1]}</Link>
                    </div>
                    <div className="product-img-view-and-details">
                        <div className="product-img-viewer">
                            <div className="left-view-draggable-bar" ref={leftViewDragableBar}>
                                <button className="view-select-arrow scroll-top" onClick={selectNextAndPrev} data-select="prev">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="aq ar as at eq er">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                                <div className="draggable-img-container">
                                    <div className="draggable-img-container-inner" ref={drgblImgContainerInner}>
                                        {product.images.map((img, i) => {
                                            return <div className={i === 0 ? 'draggable-img selected' : 'draggable-img'} key={i}>
                                                <img src={process.env.REACT_APP_API_URL + '/' + img.filePath} alt="product" />
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <button className="view-select-arrow scroll-bottom" onClick={selectNextAndPrev} data-select="next">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="aq ar as at eq er" >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                            </div>
                            <div className="main-all-img-container">
                                <div className="product-img-container-inner" ref={viewableImgContainer}>
                                    {product.images.map((img, i) => {
                                        return <div className="img-container" key={i}>
                                            <div className="product-img--main" style={{ backgroundImage: `url("${process.env.REACT_APP_API_URL + "/" + img.filePath}")`, transformOrigin: "1.821862% 57.6%" }} />
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="product-detail" data-id={product.id}>
                            <h2>{product.name}</h2>
                            <div className="product-price-row">
                                <div className="product-prices">
                                    <p className='product-price discount-price'>৳{product.dprice}</p>
                                    <p className='product-price old-price'><small>৳{product.price}</small></p>
                                </div>
                                <div className={`stock-in-out ${product.stock}`}>
                                    {product.stock === 'in' ? <span>In stock</span> : <span>Out of stock</span>}
                                </div>
                                <button className="share-product" onClick={shareBtnClickHandler}>
                                    <ShareIcon width={25} height={25} />
                                </button>
                            </div>
                            <div className="small-details">
                                <p className="tertiary-color">{product.id ? ('Product Code: ' + product.id) : ''}</p>
                                <p className="tertiary-color">{product.modelname ? ('Model: ' + product.modelname) : ''}</p>
                                <p className='tertiary-color'>Warranty: {mappings.warrantyMapping[product.warranty]}</p>
                                <p className='tertiary-color'>Category: {mappings.categoryMapping[product.category]}</p>
                            </div>
                            <div>
                                <span className='tertiary-color'>Available colors:</span>
                                <div className="product-colors">
                                    {product.color.split(',').map((clr, i) => <span key={i} onClick={selectColorHandler}>{clr}</span>)}
                                </div>
                            </div>
                            <div className="product-view-bottom-row">
                                <div className="quantity">
                                    <button onClick={quantityHandler} data-value="decrease">-</button>
                                    <input type="number" min={1} max={10} value={1} readOnly />
                                    <button onClick={quantityHandler}  data-value="increase">+</button>
                                </div>
                                <button className="add-to-cart" onClick={addToCart}>
                                    Add to cart<CartIcon width={23} height={23} />
                                </button>
                                <button className="cart-page-btn" onClick={gotoCartPage}>
                                    <CartPageIcon width={23} height={23} />
                                    <span className={`cart-counter${items && items.length > 0 ? ' active' : ''}`}>{items && items.length > 0 ? items.length : '0'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='product-desc-outer'>
                        <h3 className='product-desc-heading secondary-color'>Description</h3>
                        <div className="product-desc-container" ref={descRef}>
                            <p className=" tertiary-color" style={{ lineHeight: '18px' }}>{truncatedText}</p>
                        </div>
                        <span className="hide-for-desk" onClick={seeMoreHandler}>See less...</span>
                    </div>
                    <div className="product-review-sec">
                        <div className="df alic jstfy-btwn mb5">
                            <h3 className='secondary-color'>Reviews</h3>
                            <span className='c-pointer pr-color'>View All</span>
                        </div>
                        <p className='tertiary-color'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto pariatur dolore reiciendis atque deserunt neque fuga doloremque repellendus quis voluptatem.</p>
                    </div>
                </div>
                <div className="more-products-container">
                    <div className="container">
                        <div className="more-pr-heading">
                            <h3>Recommended</h3>
                            <span>View All</span>
                        </div>
                        <Products prList={prList} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}