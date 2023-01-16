import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoCreateOutline, IoNotificationsOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const Header = () => {


    const { user, logOut } = useContext(AuthContext)
    const handleSubmit = data => {
        console.log(data)

    }

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.error(error))
    }


    return (
        <div className="navbar bg-base-100 container mx-auto mb-5">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost md:hidden lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">

                        {
                            user ?
                                <div className='flex items-center gap-5'>
                                    <div className="avatar">
                                        <div className="w-10 rounded-full">
                                            <LazyLoadImage src={user?.photoURL ? user?.photoURL : "https://i.ibb.co/DM3jqw5/Profile-avatar-placeholder-large.png"} />
                                        </div>
                                    </div>
                                    <div className='rounded-xl btn btn-error btn-outline focus:text-neutral '><a onClick={handleLogOut}>Logout</a></div>
                                </div>
                                :
                                <div>
                                    <Link to="/login" className="btn btn-primary btn-outline border  text-primary mr-5 w-20 font-normal mb-3">Login</Link>
                                    <Link to="/register" className="btn btn-primary text-white w-32 font-normal shadow-sm">Get Started</Link>
                                </div>
                        }
                    </ul>
                </div>

                <Link to="/" className="font-semibold normal-case text-xl lg:text-4xl text-primary ">
                    Coders<span className='text-neutral'>Corner</span>
                </Link>
                <Link to={user ? "/new-blog" : "/login"} className="md:hidden lg:hidden ml-24 bg-transparent border-none text-primary  font-normal"><p className='flex items-center gap-3'><IoCreateOutline className='text-xl ' /> Write</p></Link>
            </div>
            <div className="navbar-center hidden md:flex lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <form onSubmit={handleSubmit} className=" w-80 lg:w-full search col-span-3 my-2 h-12">
                        <div className="input-group">
                            <input type="text" placeholder="Search blog" className="input input-bordered border-primary  w-96 focus:outline-none focus:shadow-lg" />
                            <button type="submit" className='bg-primary text-base-100 font-bold px-3 text-2xl'><AiOutlineSearch /></button>
                        </div>
                    </form>
                </ul>
            </div>
            <div className="navbar-end hidden md:flex lg:flex">
                <Link to={user ? "/new-blog" : "/login"} className="bg-transparent border-none text-primary mr-5 w-20 font-normal"><p className='flex items-center gap-3'><IoCreateOutline className='text-xl ' /> Write</p></Link>
                <div className="dropdown dropdown-bottom dropdown-end  px-5">
                    <label tabIndex={0} className="m-1"><Link className="bg-transparent border-none text-primary mr-5 w-5 font-normal md:hidden"><p><IoNotificationsOutline className='text-xl ' /></p></Link></label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border-2">
                        <li><a>No new Notification</a></li>
                    </ul>
                </div>
                {
                    user ?
                        <div className='flex items-center gap-5'>
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <LazyLoadImage src={user?.photoURL ? user?.photoURL : "https://i.ibb.co/DM3jqw5/Profile-avatar-placeholder-large.png"} />
                                </div>
                            </div>
                            <div className='rounded-xl btn btn-error btn-outline focus:text-neutral '><a onClick={handleLogOut}>Logout</a></div>
                        </div>
                        :
                        <div className='md:flex'>
                            <Link to="/login" className="btn btn-primary btn-outline border  text-primary mr-5 w-20 font-normal">Login</Link>
                            <Link to="/register" className="btn btn-primary text-white w-32 font-normal shadow-sm md:hidden">Get Started</Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default Header;