import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import { ReactComponent as CartIcon } from '../assets/icons/cart normal.svg';
import '../styles/products.css'

export default function Product({ hdr }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pid = queryParams.get('id');
    const [product, setProduct] = useState(null);

    const addToCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const itemsJSON = cartItems ? cartItems : [];
        const headerCartCounter = document.querySelector('.header-cart-btn span');

        itemsJSON.push(product);
        localStorage.setItem('cart', JSON.stringify(itemsJSON));
        headerCartCounter.classList.add('active');
        headerCartCounter.innerHTML = itemsJSON.length
    }

    // =================== EQUI js start =================== //
    const viewableImgContainer = useRef(null);
    const drgblImgContainerInner = useRef(null);
    const leftViewDragableBar = useRef(null);

    let sliderCount = useRef(0), selectBarBoxesSize = drgblImgContainerInner.offsetHeight / drgblImgContainerInner.childElementCount, selectBarTransformPX = useRef(0);
    


    const selectNextAndPrev = (e) => {
        const beforeSelectedBox = document.querySelector(".left-view-draggable-bar .draggable-img.selected");
        if (e.dataset.select === "prev" && beforeSelectedBox.previousElementSibling !== null) {
            beforeSelectedBox.classList.remove("selected");
            beforeSelectedBox.previousElementSibling.classList.add("selected");
            viewerImgSlider("prev");
            if (sliderCount.current < (drgblImgContainerInner.childElementCount - 2)) {
                selectBarTransformPX.current -= selectBarBoxesSize;
                if (selectBarTransformPX.current < 0) {
                    selectBarTransformPX.current = 0;
                }
                selectBarTransform();
            }
        } else if (e.dataset.select === "next" && beforeSelectedBox.nextElementSibling !== null) {
            beforeSelectedBox.classList.remove("selected");
            beforeSelectedBox.nextElementSibling.classList.add("selected");
            viewerImgSlider("next");
            if (sliderCount.current > 2 && sliderCount.current !== (drgblImgContainerInner.childElementCount - 1)) {
                selectBarTransformPX.current += selectBarBoxesSize;
                selectBarTransform();
            }
        }
    }

    function selectBarTransform() {
        drgblImgContainerInner.style.transform = `translate3d(0px, -${selectBarTransformPX.current}px, 0px)`;
    }

    const prImages = document.querySelectorAll(".product-img--main");
    prImages.forEach((productImage) => {
        productImage.addEventListener("mousemove", function(e) {
            const XY = {
                x: ((e.pageX - viewableImgContainer.offsetLeft) / this.offsetWidth) * 100,
                y: ((e.pageY - viewableImgContainer.offsetTop) / this.offsetHeight) * 100
            };
            productImage.style.transformOrigin = XY.x + "%" + XY.y + "%";
        })
    });

    function viewerImgSlider(slide) {
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

    // =================== EQUI js end =================== //

    useEffect(() => {
        if (pid) {
            fetch(`https://dummyjson.com/products/${pid}`)
                .then((response) => response.json())
                .then((data) => setProduct(data))
                .catch((error) => console.error('Error fetching product details:', error));
        }
    }, [pid]);

    useEffect(() => {
        if (!product || !leftViewDragableBar.current || !drgblImgContainerInner.current) return;

        const allImgViewBarBoxes = leftViewDragableBar.current.querySelectorAll(".draggable-img");
        allImgViewBarBoxes.forEach((imgBox) => {
            const selectBarImgSrc = imgBox.querySelector("img").src;
            const newImgContainer = document.createElement("div");
            const newProductImgMain = document.createElement("div");
            newImgContainer.className = "img-container";
            newProductImgMain.className = "product-img--main";
            newProductImgMain.style.backgroundImage = `url(${selectBarImgSrc})`;
            newImgContainer.appendChild(newProductImgMain);
            viewableImgContainer.appendChild(newImgContainer);
            //============================================
            imgBox.addEventListener("click", () => {
                if (!imgBox.classList.contains("selected")) {
                    sliderCount.current = [...allImgViewBarBoxes].indexOf(imgBox);
                    const beforeSelectedBox = document.querySelector(".left-view-draggable-bar .draggable-img.selected");
                    beforeSelectedBox.classList.remove("selected");
                    imgBox.classList.add("selected");
                    if (sliderCount.current > 2 && sliderCount.current !== drgblImgContainerInner.childElementCount - 1) {
                        selectBarTransformPX.current = selectBarBoxesSize * (sliderCount.current - 2);
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
        <div className="product-page-container">
            <div className="product-image-container">
                {/* <img src={product.thumbnail} className='product-image' alt={product.title} /> */}
            </div>
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
                                    <img src={product.thumbnail} alt="product" />
                                </div>
                                <div className="draggable-img">
                                    <img src={product.thumbnail} alt="product" />
                                </div>
                                <div className="draggable-img selected">
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
                                <div className="draggable-img">
                                    <img src={product.thumbnail} alt="product" />
                                </div>
                                <div className="draggable-img">
                                    <img src={product.thumbnail} alt="product" />
                                </div>
                            </div>
                        </div>
                        <button className="view-select-arrow scroll-bottom" ref={selectNextAndPrev} data-select="next">
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
                                        backgroundImage: `url(${product.thumbnail})`,
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

                <div className="product-detail">
                    <h2>{product.title}</h2>
                    <p>Price: ${product.price}</p>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <button className="add-to-cart" onClick={addToCart}>
                        <CartIcon width={25} height={25} />
                    </button>
                </div>
            </div>
        </div>
    )
}