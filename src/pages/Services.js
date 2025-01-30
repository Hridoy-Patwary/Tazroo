import React, { useEffect } from 'react'
import '../styles/services.css';

export default function Services({ hdr }) {
    
    useEffect(() => {
        hdr(true);
    }, [hdr]);

    return (
        <div className='service-page-container'>
            <div className="container">
                <div className="service-opt-flex">
                    <button className='book-a-service'>Book a Service</button>
                    <button className='become-a-servicer'>Become a Servicer</button>
                </div>
                <div className="t-center tertiary-color">
                    <h3>Coming soon!</h3>
                </div>
            </div>
        </div>
    )
}