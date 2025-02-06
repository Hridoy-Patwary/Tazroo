import React from 'react'
import '../styles/filter-bar.css'

export default function FilterBar() {
    return (
        <div className='filter-bar'>
            <div className="filter-box">
                <h3>Price Range</h3>
                <div className="df alic jstfy-btwn">
                    <input type="number" name='pmin' placeholder='0' />
                    <input type="number" name='pmax' placeholder='100000' />
                </div>
            </div>
            <div className="filter-box">
                <h3>Availability</h3>
                <div className="filter-box-inputs">
                    <div className="input-row">
                        <input type="checkbox" name="av-in" />
                        <span>In Stock</span>
                    </div>
                    <div className="input-row">
                        <input type="checkbox" name="av-out" />
                        <span>In Stock</span>
                    </div>
                    <div className="input-row">
                        <input type="checkbox" name="av-up" />
                        <span>In Stock</span>
                    </div>
                </div>
            </div>
        </div>
    )
}