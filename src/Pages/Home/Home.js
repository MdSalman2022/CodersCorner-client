import React from 'react';
import About from '../../components/About/About';
import Blog from '../../components/Blog/Blog';
import HeroSection from '../../components/HeroSection/HeroSection';
import Industry from '../../components/Industry/Industry';
import Newsletter from '../../components/Newsletter/Newsletter';

const Home = () => {
    return (
        <div>
            <HeroSection />
            <Blog />
            <About />
            <Industry />
            <Newsletter />
        </div>
    );
};

export default Home;