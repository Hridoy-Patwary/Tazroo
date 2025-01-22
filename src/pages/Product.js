import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer'
import { ReactComponent as CartIcon } from '../assets/icons/cart normal.svg';
import '../styles/products.css'

export default function Product({ hdr }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pid = queryParams.get('id');
    const [product, setProduct] = useState(null);
    const warrantyMapping = {
        'sd': 'Same Day',
        '3mnth': '3 Months',
        '6mnth': '6 Months',
        '1yr': '1 Year',
        '2yr': '2 Years',
        '3yr': '3 Years'
    };
    const categoryMapping = {
        'it': 'IT Accessories',
        'elc': 'Electronics',
        'clo': 'Cloathing'
    }

    const addToCart = (e) => {
        const headerCartCounter = document.querySelector('.header-cart-btn span');
        const id = e.target.closest('.product-detail').dataset.id;
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const itemsJSON = cartItems ? cartItems : [];
        const updatedItems = itemsJSON.map(item =>
            item.id === id ? { ...item, quantity: item.quantity ? (parseInt(item.quantity) + 1) : 1 } : item
        );

        if (updatedItems.length === 0) {
            product.quantity = 1;
            itemsJSON.push(product);
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
        productImage.addEventListener("mousemove", function (e) {
            const XY = {
                x: ((e.pageX - viewableImgContainer.current.offsetLeft) / this.offsetWidth) * 100,
                y: ((e.pageY - viewableImgContainer.current.offsetTop) / this.offsetHeight) * 100
            };
            productImage.style.transformOrigin = XY.x + "%" + XY.y + "%";
        })
    });

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

    const selectColorHandler = () => {
        console.log('helo');
    }

    // =================== EQUI js end =================== //

    useEffect(() => {
        if (pid) {
            fetch(process.env.REACT_APP_API_URL + '/api/v1/product/details', {
                method: 'post',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ id: pid })
            }).then((response) => response.json())
                .then((data) => setProduct(data))
                .catch((error) => console.error('Error fetching product details:', error));
        }
    }, [pid]);

    useEffect(() => {
        if (!product || !leftViewDragableBar.current || !drgblImgContainerInner.current) return;
        selectBarBoxesSize.current = drgblImgContainerInner.current.offsetHeight / drgblImgContainerInner.current.childElementCount;
        const allImgViewBarBoxes = leftViewDragableBar.current.querySelectorAll(".draggable-img");

        allImgViewBarBoxes.forEach((imgBox) => {
            const selectBarImgSrc = imgBox.querySelector("img").src;
            const newImgContainer = document.createElement("div");
            const newProductImgMain = document.createElement("div");
            newImgContainer.className = "img-container";
            newProductImgMain.className = "product-img--main";
            newProductImgMain.style.backgroundImage = `url(${selectBarImgSrc})`;
            newImgContainer.appendChild(newProductImgMain);
            viewableImgContainer.current.appendChild(newImgContainer);
            //============================================
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
                    <div className="product-img-viewer">
                        <div className="left-view-draggable-bar" ref={leftViewDragableBar}>
                            <button className="view-select-arrow scroll-top" onClick={selectNextAndPrev} data-select="prev">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="aq ar as at eq er"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            <div className="draggable-img-container">
                                <div
                                    className="draggable-img-container-inner"
                                    style={{ transform: "translate3d(0px, -257.5px, 0px)" }}
                                    ref={drgblImgContainerInner}
                                >
                                    <div className="draggable-img">
                                        <img src={process.env.REACT_APP_API_URL + '/' + product.images[0].filePath} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={process.env.REACT_APP_API_URL + '/' + product.images[1].filePath} alt="product" />
                                    </div>
                                    <div className="draggable-img selected">
                                        <img src={process.env.REACT_APP_API_URL + '/' + product.images[2].filePath} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={process.env.REACT_APP_API_URL + '/' + product.images[3].filePath} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={product.thumbnail} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={product.thumbnail} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={product.thumbnail} alt="product" />
                                    </div>
                                    <div className="draggable-img">
                                        <img src={product.thumbnail} alt="product" />
                                    </div>
                                </div>
                            </div>
                            <button className="view-select-arrow scroll-bottom" onClick={selectNextAndPrev} data-select="next">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="aq ar as at eq er"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        </div>
                        <div className="main-all-img-container">
                            <div
                                className="product-img-container-inner"
                                style={{ transform: "translate3d(-200%, 0px, 0px)" }}
                                ref={viewableImgContainer}
                            >
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`,
                                            transformOrigin: "1.821862% 57.6%"
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${process.env.REACT_APP_API_URL + '/' + product.images[0].filePath})`,
                                            transformOrigin: "95.951417% 38.8%"
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`,
                                            transformOrigin: "2.834008% 55%"
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`,
                                            transformOrigin: "1.012146% 45.6%"
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`
                                        }}
                                    />
                                </div>
                                <div className="img-container">
                                    <div
                                        className="product-img--main"
                                        style={{
                                            backgroundImage: `url(${product.thumbnail})`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="product-detail" data-id={product.id}>
                        <h2>{product.name}</h2>
                        <div className="product-prices">
                            <p className='product-price discount-price'>৳{product.dprice}</p>
                            <p className='product-price old-price'><small>৳{product.price}</small></p>
                        </div>
                        <div className="small-details">
                            <p className="tertiary-color">{product.modelname ? ('Model: ' + product.modelname) : ''}</p>
                            <p className='tertiary-color'>Warranty: {warrantyMapping[product.warranty]}</p>
                            <p className='tertiary-color'>Category: {categoryMapping[product.category]}</p>
                        </div>
                        <div className="product-colors">
                            {product.color.split(',').map((clr, i) => <span key={i} onClick={selectColorHandler}>{clr}</span>)}
                        </div>
                        <p className='secondary-color'>{product.description}</p>
                        <button className="add-to-cart" onClick={addToCart}>
                            <CartIcon width={25} height={25} />
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}