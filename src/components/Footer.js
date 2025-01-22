import React from 'react'
import '../styles/footer.css'

export default function Footer() {
    return (
        <div className='footer-container'>
            <div className="container footer-main">
                <div className="footer-column">
                    <h3>Customer care</h3>
                    <ul>
                        <li>
                            <span>Help Center</span>
                        </li>
                        <li>
                            <span>How to Buy</span>
                        </li>
                        <li>
                            <span>Contact Us</span>
                        </li>
                        <li>
                            <span>Complain Management</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Contact</h3>
                    <ul>
                        <li>
                            <span>support@tazroo.com</span>
                        </li>
                        <li>
                            <span>contact@tazroo.com</span>
                        </li>
                        <li>
                            <span>business@tazroo.com</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>About Us</h3>
                    <ul>
                        <li>
                            <span>Privacy & Policy</span>
                        </li>
                        <li>
                            <span>Terms & Conditions</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span><b>Tazroo</b> copyright 2025 &copy;</span>
            </div>
        </div>
    )
}