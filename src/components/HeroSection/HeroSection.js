import React from 'react';
import styles from './HeroSection.module.css'

const HeroSection = () => {
    return (
        <div className="hero  lg:min-h-96 bg-primary lg:py-20">
            <div className="hero-content text-center">
                <div className={`max-w-full ${styles.text}`}>
                    <h1 className="text-2xl lg:text-7xl font-semibold text-accent">Stay curious.</h1>
                    <p className="py-6 text-accent text-xl">Subscribe to learn about new product features, the latest in technology</p>
                    <div className="form-control">
                        <label className="input-group flex justify-center my-10">
                            <input type="text" placeholder="example@gmail.com" className="input input-bordered border-warning border-2 focus:outline-none focus-within:shadow-lg lg:w-96" />
                            <span className='btn-warning'>Get Started</span>
                        </label>
                    </div>
                    <button className="btn btn-warning rounded-3xl">Start Reading</button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;