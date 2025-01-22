import React, { useEffect, useRef, useState } from 'react'
import '../../styles/account.css'

export default function AddProductAdmin() {
    const formRef = useRef();
    const dragDropBox = useRef();
    const loadingWin = useRef();
    const [droppedFiles, setDroppedFiles] = useState({});

    const fileChangeHandler = (e) => {
        const dropType = e.target.closest('.media-drag-drop').dataset.type;
        const newFiles = Array.from(e.target.files).filter((file) =>
            file.type.includes("image")
        );

        setDroppedFiles((prev) => {
            const updatedFiles = { ...prev };
            if (!updatedFiles[dropType]) {
                updatedFiles[dropType] = [];
            }
            updatedFiles[dropType].push(...newFiles);
            return updatedFiles;
        });

        const displayContainer = e.target.closest('.media-drag-drop').querySelector(".media-display");
        newFiles.forEach((file) => {
            if (!displayContainer.querySelector(`[data-filename="${file.name}"]`)) {
                const newImgElm = document.createElement("img");
                newImgElm.draggable = true;
                newImgElm.ondragstart = dragStartHandle;
                newImgElm.dataset.filename = file.name;
                newImgElm.src = URL.createObjectURL(file);
                displayContainer.append(newImgElm);
            }
        });
    };


    const handleSubmit = async (e) => {
        const target = e.target;
        const form = formRef.current;
        const formData = new FormData(form);

        target.classList.add('loading');
        loadingWin.current.classList.add('active');
        loadingWin.current.children[0].classList.add('loader');

        Array.from(droppedFiles['image']).forEach((file) => {
            formData.append('files', file);
        });

        try {
            await fetch(process.env.REACT_APP_API_URL+'/api/v1/product', {
                method: 'post',
                body: formData
            }).then((res) => res.json()).then((data) => {
                console.log(data);
                target.classList.remove('loading');
                loadingWin.current.classList.remove('active');
                loadingWin.current.children[0].classList.remove('loader');
                formRef.current.reset();
                setDroppedFiles({});
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error)
        }
    }

    const dragStartHandle = (e) => {
        e.dataTransfer.setData(
            "indx",
            Array.prototype.indexOf.call(e.target.parentElement.children, e.target)
        );
    };

    useEffect(() => {
        const d = dragDropBox.current;

        if (d) {
            const handleDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const dropType = d.parentElement.dataset.type;
                const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
                    file.type.includes("image")
                );

                if (newFiles.length === 0) {
                    alert("Please drop only images!");
                    return;
                }

                setDroppedFiles((prev) => {
                    const updatedFiles = { ...prev };
                    if (!updatedFiles[dropType]) {
                        updatedFiles[dropType] = [];
                    }
                    updatedFiles[dropType].push(...newFiles);
                    return updatedFiles;
                });

                const displayContainer = d.parentElement.querySelector(".media-display");
                newFiles.forEach((file) => {
                    if (!displayContainer.querySelector(`[data-filename="${file.name}"]`)) {
                        const newImgElm = document.createElement("img");
                        newImgElm.draggable = true;
                        newImgElm.ondragstart = dragStartHandle;
                        newImgElm.id = Date.now();
                        newImgElm.dataset.filename = file.name;
                        newImgElm.src = URL.createObjectURL(file);
                        displayContainer.append(newImgElm);
                    }
                });

                d.classList.remove("dragover");
            };

            const handleDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();
                d.classList.add("dragover");
            };

            const handleDragLeave = (e) => {
                e.preventDefault();
                e.stopPropagation();
                d.classList.remove("dragover");
            };

            d.addEventListener("drop", handleDrop);
            d.addEventListener("dragover", handleDragOver);
            d.addEventListener("dragleave", handleDragLeave);

            return () => {
                d.removeEventListener("drop", handleDrop);
                d.removeEventListener("dragover", handleDragOver);
                d.removeEventListener("dragleave", handleDragLeave);
            };
        }
    }, []);
    return (
        <div className='admin-panel-add-product'>
            <div className="show-loading-win" ref={loadingWin}>
                <span></span>
                <span className='loading-win-please-wait'>Please wait...</span>
            </div>
            <form method="post" action="" onSubmit={(e) => e.preventDefault()} data-logid="" className="main-container" ref={formRef}>
                <div className="inp-boxes-grid-container">
                    <div className="address-box">
                        <div className="inp-box modelname">
                            <span>Model Name</span>
                            <input type="text" name="modelname" required="" />
                        </div>
                        <div className="inp-box pname">
                            <span>Product Name</span>
                            <input type="text" name="name" required="" />
                        </div>
                        <div className="inp-box brand">
                            <span>Brand</span>
                            <input type="text" name="brand" required="" />
                        </div>
                        <div className="inp-box dprice">
                            <span>Discount Price</span>
                            <input type="text" name="dprice" />
                        </div>
                        <div className="inp-box rprice">
                            <span>Regular Price</span>
                            <input type="text" name="price" required="" />
                        </div>
                    </div>
                    <div className="inp-box size">
                        <span>Size</span>
                        <input type="text" name="size" required="" />
                    </div>
                    <div className="inp-box color">
                        <span>Color</span>
                        <input type="text" name="color" required="" />
                    </div>
                    <div className="inp-box w25 depertment">
                        <span>Stock Status</span>
                        <div className="inp-box-inner">
                            <select name="stock">
                                <option value="in">In Stock</option>
                                <option value="out">Out Of Stock</option>
                            </select>
                        </div>
                    </div>
                    <div className="inp-box w25 instructiong_type">
                        <span>Category</span>
                        <div className="inp-box-inner">
                            <select name="category">
                                <option value="it">IT Accessories</option>
                                <option value="elc">Electronics</option>
                                <option value="clo">Cloathing</option>
                            </select>
                        </div>
                    </div>
                    <div className="inp-box w25 availability">
                        <span>Pickup Location</span>
                        <div className="inp-box-inner">
                            <select name="location">
                                <option value="for_sale">Anywhere</option>
                                <option value="sold">Cumilla Computer &amp; IT Center</option>
                                <option value="under_offer">Add Location</option>
                            </select>
                        </div>
                    </div>
                    <div className="inp-box w25 warranty">
                        <span>Warranty</span>
                        <div className="inp-box-inner">
                            <select name="warranty">
                                <option value="sd">Same Day</option>
                                <option value="3mnth">3 Months</option>
                                <option value="6mnth">6 Months</option>
                                <option value="1yr">1 Year</option>
                                <option value="2yr">2 Years</option>
                                <option value="3yr">3 Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="inp-box desc-and-feature">
                        <span>Description</span>
                        <textarea
                            className="desc-feature-inp"
                            name="description"
                            defaultValue={""}
                        />
                    </div>
                    <div className="inp-box media-drag-drop" data-type="image" multiple="" accept="image/*" >
                        <div className="drag-drop-box" ref={dragDropBox}>
                            <div className="box-inner">
                                <div className="mid-content">
                                    <span>Drag And Drop here.</span>
                                    <br />
                                    <span>Or</span>
                                    <div className="inn-media-inp">
                                        <span>Select file</span>
                                        <input type="file" multiple onChange={fileChangeHandler} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="media-display" />
                    </div>
                    <div className="add-product-submit-btn">
                        <button className="property-add-submit-btn sign-anim-btn" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}