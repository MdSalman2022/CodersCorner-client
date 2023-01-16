import React from 'react';
import { FaAmazon } from 'react-icons/fa';
import { SiIntel } from 'react-icons/si';
import { RxNotionLogo } from 'react-icons/rx';
import { FaBehanceSquare } from 'react-icons/fa';
import { IoLogoCodepen } from 'react-icons/io';
import { IoLogoGithub } from 'react-icons/io';
import { IoLogoTux } from 'react-icons/io';
import { SiFirebase } from 'react-icons/si';



const Industry = () => {
    return (
        <div>
            <section className=" bg-base-100 py-10">
                <div className="container p-4 mx-auto text-center">
                    <h2 className="text-4xl font-bold">Trusted by the industry leaders</h2>
                </div>
                <div className="container grid grid-cols-3 lg:flex lg:flex-wrap justify-center mx-auto text-gray-400">
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><FaAmazon /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><SiIntel /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><FaBehanceSquare /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><IoLogoCodepen /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><IoLogoGithub /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><IoLogoTux /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><SiFirebase /></p>
                    </div>
                    <div className="flex justify-center w-full  align-middle md:w-1/3 xl:w-1/4">
                        <p className='text-6xl text-neutral p-5 lg:p-20 hover:text-primary duration-300 '><RxNotionLogo /></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Industry;