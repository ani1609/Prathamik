import React from 'react';
import './index.css';
import './Footer.css';


function Footer()
{

    return(
        <div>
            <div className='footer_parent'>
                
                <div className='block_2'>
                    <h4>Resources</h4>
                    <a href=''>Sapmle</a>
                    <a href=''>Something</a>
                    <a href=''>Example</a>
                    <a href=''>Example</a>
                </div>
                <div className='block_3'>
                    <h4>Support</h4>
                    <a href=''>Contact Us</a>
                    <a href=''>Sample</a>
                    <a href=''>FAQs</a>
                    <a href=''>Example</a>
                </div>
                <div className='block_4'>
                    <h4>Company</h4>
                    <a href=''>Example</a>
                    <a href=''>Sapmle</a>
                    <a href=''>Example</a>
                    <a href=''>About Us</a>
                </div>
                <div className='block_5'>
                <h4>Support</h4>
                    <a href=''>Contact Us</a>
                    <a href=''>Sample</a>
                    <a href=''>FAQs</a>
                    <a href=''>Example</a>
                </div>
                <div className='block_1'>
                    <a className='footer_logo_container' href=''>
                        <div className='footer_logo'></div>
                        <h1>Prathamik</h1>
                    </a>
                    <h4>Connect with us</h4>
                    <div className='social_icons'>
                        <a><i class="fa-brands fa-square-facebook"></i></a>
                        <a><i class="fa-brands fa-square-twitter"></i></a>
                        <a><i class="fa-brands fa-square-instagram"></i></a>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Footer;