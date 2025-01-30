import React from 'react'
import '../styles/footer.css'

export default function Footer() {
    const contactMails = ['support@tazroo.com', 'contact@tazroo.com', 'business@tazroo.com'];
    const mailMap = {
        'support': 'Get help from Tazroo support team',
        'contact': 'Contact with Tazroo',
        'business': 'Do business with Tazroo'
    }

    return (
        <div className='footer-container'>
            <div className="container footer-main">
                <div className="footer-column">
                    <h3>Customer care</h3>
                    <ul>
                        <li>
                            <span>Complain Management</span>
                        </li>
                        <li>
                            <span>Help Center</span>
                        </li>
                        <li>
                            <span>How to Buy</span>
                        </li>
                        <li>
                            <span>Contact Us</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Contact</h3>
                    <ul>
                        {
                            contactMails.map((mail, i) => {
                                return <li key={i}>
                                    <a href={`mailto:${mail}?subject=${mailMap[mail.split('@')[0]]}`}>{mail}</a>
                                </li>
                            })
                        }
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