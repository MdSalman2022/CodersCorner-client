import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />

        </div>
    );
};

export default Main;