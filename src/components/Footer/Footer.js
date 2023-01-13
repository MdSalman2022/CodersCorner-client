import React from 'react';

const Footer = () => {
    return (
        <div className='bg-gray-900 '>
            <footer className="footer p-10 text-neutral-content container mx-auto">
                <div>
                    <span className="footer-title">Company</span>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Careers</a>
                    <a className="link link-hover">Press</a>
                    <a className="link link-hover">News</a>
                    <a className="link link-hover">Contact</a>
                </div>
                <div>
                    <span className="footer-title">Resources</span>
                    <a className="link link-hover">Blog</a>
                    <a className="link link-hover">Newsletter</a>
                    <a className="link link-hover">Events</a>
                    <a className="link link-hover">Help center</a>
                    <a className="link link-hover">Tutorial</a>
                    <a className="link link-hover">Support</a>
                </div>
                <div>
                    <span className="footer-title">Social</span>
                    <a className="link link-hover">Twitter</a>
                    <a className="link link-hover">Linkedin</a>
                    <a className="link link-hover">Facebook</a>
                    <a className="link link-hover">Github</a>
                    <a className="link link-hover">Dribble</a>
                </div>
                <div>
                    <span className="footer-title">Legal</span>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </div>
            </footer>
        </div>
    );
};

export default Footer;