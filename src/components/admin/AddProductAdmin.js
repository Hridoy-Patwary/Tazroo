import React, { useRef, useState } from 'react'

export default function AddProductAdmin() {
    const formRef = useRef();
    const [files, setFiles] = useState(null);
    let droppedFiles = {}

    const swap = (node1, node2) => {
        const afterNode2 = node2.nextElementSibling;
        const parent = node2.parentNode;
        node1.replaceWith(node2);
        parent.insertBefore(node1, afterNode2);
    }

    const dropFile = (e) => {
        e.preventDefault()
        let indx = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);
        var data = e.dataTransfer.getData("indx");
        try {
            swap(e.target.parentElement.children[parseInt(data)], e.target.parentElement.children[indx])
            var tmp = droppedFiles[e.target.closest('.inp-box').dataset.type][indx];
            droppedFiles[e.target.closest('.inp-box').dataset.type][indx] = droppedFiles[e.target.closest('.inp-box').dataset.type][data];
            droppedFiles[e.target.closest('.inp-box').dataset.type][data] = tmp;
        } catch (e) {
            console.log(e);
        }
    }

    const fileChangeHandler = (e) => {
        setFiles(e.target.files);
    }

    const handleSubmit = async () => {
        const form = formRef.current;
        const formData = new FormData(form);
        
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        const obj = Object.fromEntries(formData);
        
        try {
            const res = await fetch('http://localhost:4000/api/v1/product', {
                method: 'post',
                body: formData
            });

            console.log(res);
        } catch (error) {
            console.log(error)
        }

        console.log(obj);
    }
    return (
        <div className='admin-panel-add-product'>
            <form method="post" action="" onSubmit={(e) => e.preventDefault()} data-logid="" className="main-container" ref={formRef}>
                <div className="inp-boxes-grid-container">
                    <div className="address-box">
                        <div className="inp-box pname">
                            <span>Product Name</span>
                            <input type="text" name="pname" required="" />
                        </div>
                        <div className="inp-box modelname">
                            <span>Model Name</span>
                            <input type="number" name="modelname" required="" />
                        </div>
                        <div className="inp-box dprice">
                            <span>Discount Price</span>
                            <input type="text" name="dprice" />
                        </div>
                        <div className="inp-box rprice">
                            <span>Regular Price</span>
                            <input type="text" name="rprice" required="" />
                        </div>
                        <div className="inp-box brand">
                            <span>Brand</span>
                            <input type="text" name="brand" required="" />
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
                                <option value="residential">In Stock</option>
                                <option value="commercial">Out Of Stock</option>
                            </select>
                        </div>
                    </div>
                    <div className="inp-box w25 instructiong_type">
                        <span>Category</span>
                        <div className="inp-box-inner">
                            <select name="category">
                                <option value="it">IT Accessories</option>
                                <option value="electronics">Electronics</option>
                                <option value="cloathing">Cloathing</option>
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
                                <option value="3yrs">3 Years</option>
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
                        <div className="drag-drop-box">
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
                        <div className="media-display" onDrop={(e) => dropFile(e)} onDragOver={(e) => e.preventDefault()} />
                    </div>
                    <div className="agent-suggestions dflex" />
                    <button className="property-add-submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
}