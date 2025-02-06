import React from 'react'

export default function Orders() {
  return (
    <div className='tab-container order-tab'>
      <div className="tab-heading">
        <h3>Your orders list</h3>
      </div>
      <div className="order-list-wrapper"></div>
      <span className="nothing-yet tertiary-color">Nothing yet</span>
    </div>
  )
}
