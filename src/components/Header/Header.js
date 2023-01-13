import React from 'react';
import { Link } from 'react-router-dom';
import { IoCreateOutline, IoNotificationsOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';


const Header = () => {


    const handleSubmit = data => {
        console.log(data)

    }


    return (
        <div className="navbar bg-base-100 container mx-auto mb-5">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Home</a></li>
                        <li><a>Features</a></li>
                        <li><a>About</a></li>
                        <li><a>Contact</a></li>
                        <li><a className="btn bg-transparent border-none text-secondary mr-2 w-full font-normal">Login</a></li>
                        <li><a className="btn btn-primary text-white w-full font-normal shadow-sm">Sign up</a></li>
                    </ul>
                </div>
                <a className="font-semibold normal-case text-4xl text-primary ">
                    Coders<span className='text-neutral'>Corner</span>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <form onSubmit={handleSubmit} className=" w-full search col-span-3 my-2 h-12">
                        <div className="input-group">
                            <input type="text" placeholder="Search blog" className="input input-bordered border-primary  w-96 focus:outline-none focus:shadow-lg" />
                            <button type="submit" className='bg-primary text-base-100 font-bold px-3 text-2xl'><AiOutlineSearch /></button>
                        </div>
                    </form>
                </ul>
            </div>
            <div className="navbar-end hidden lg:flex">
                <Link className="bg-transparent border-none text-primary mr-5 w-20 font-normal"><p className='flex items-center gap-3'><IoCreateOutline className='text-xl ' /> Write</p></Link>
                <Link className="bg-transparent border-none text-primary mr-5 w-5 font-normal"><p><IoNotificationsOutline className='text-xl ' /></p></Link>
                <Link className="btn btn-primary btn-outline border  text-primary mr-5 w-20 font-normal">Login</Link>
                <Link className="btn btn-primary text-white w-32 font-normal shadow-sm">Get Started</Link>
            </div>
        </div>
    );
};

export default Header;