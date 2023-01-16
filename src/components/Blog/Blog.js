import React, { useEffect, useState } from 'react';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const Blog = () => {

    const [blogs, setBlogs] = useState([])

    const [writers, setWriters] = useState([])

    const [topics, setTopics] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_LINK}/blogs`)
            .then(res => res.json())
            .then(data => setBlogs(data))
    }, [])


    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_LINK}/writers`)
            .then(res => res.json())
            .then(data => setWriters(data))
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_LINK}/topics`)
            .then(res => res.json())
            .then(data => setTopics(data))
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_LINK}/topics`)
            .then(res => res.json())
            .then(data => setTopics(data))
    }, [])


    let featured = blogs?.filter(blog => blog.featured === true)

    // console.log(blogs[0]?.Topics.map(topic => topic))

    // console.log(blogs.map(blog => blog.Topics?.map(topic => console.log(topic))))

    return (
        <div className='bg-base-100 mt-10'>
            <div className="container mx-auto px-3 lg:px-0">
                <div className="recent">
                    <p className="text-xl font-semibold">
                        Recent blog posts
                    </p>

                    <div className="grid md:grid-cols-4 lg:grid-cols-2 lg:gap-10">
                        <div className="md:col-span-4 lg:col-span-1 card w-full lg:h-96 my-10">
                            <LazyLoadImage className='rounded-2xl object-cover border-primary border lg:h-96' src={featured[0]?.img} alt="Shoes" />
                            <div className=" mt-5 space-y-2">
                                <p className="font-semibold text-primary">{featured[0]?.writer} - {`${(parseInt(new Date() - new Date(featured[0]?.date)) / (1000 * 60 * 60)).toFixed(0)} hours ago`}</p>
                                <h2 className="card-title flex justify-between duration-200 hover:text-primary">
                                    <p><Link to={`content/${featured[0]?._id}`}>{featured[0]?.title} </Link></p> <Link to={`content/${featured[0]?._id}`} className=''><RxOpenInNewWindow /></Link>

                                </h2>
                                <p>{`${featured[0]?.description.length > 200 ? `${featured[0]?.description.substring(0, 200)}...` : featured[0]?.description}`}<Link className='text-blue-700'>Read More</Link> <functionalities /></p>
                                <div className="card-actions justify-start">
                                    {
                                        featured[0]?.Topics?.map(topic => <div className={`badge badge-outline ${topic === 'CSS' || topic === 'JavaScript' ? ' text-yellow-700 bg-yellow-50' : topic === 'React' || topic === 'Rest API' || topic === 'Programming' ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-green-50'}`}>{topic}</div>)
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 md:grid md:grid-cols-2 lg:col-span-1 lg:flex lg:flex-col gap-5 my-10 space-y-5">
                            {
                                <div className="card space-y-2 md:space-y-5 lg:card-side bg-base-100">
                                    <LazyLoadImage className='rounded-2xl  object-cover border-primary border  h-60 lg:h-full lg:w-72' src={featured[1]?.img} alt="Movie" />
                                    <div className=" px-5 space-y-3">
                                        <p className="font-semibold text-primary">{featured[1]?.writer} - {`${(parseInt(new Date() - new Date(featured[1]?.date)) / (1000 * 60 * 60)).toFixed(0)} hours ago`}</p>
                                        {/* <h2 className="card-title">{featured[1]?.title} </h2> */}
                                        <h2 className="card-title duration-200 hover:text-primary"> <Link to={`content/${featured[1]?._id}`}>{featured[1]?.title} </Link> </h2>

                                        <p className='leading-7 tracking-wide...'>{`${featured[1]?.description.length > 200 ? `${featured[1]?.description.substring(0, 200)}...` : featured[1]?.description}`}<Link className='text-blue-700'>Read More</Link></p>
                                        <div className="card-actions justify-start">
                                            {
                                                featured[1]?.Topics?.map(topic => <div className={`badge badge-outline ${topic === 'CSS' || topic === 'JavaScript' ? ' text-yellow-700 bg-yellow-50' : topic === 'React' || topic === 'Rest API' || topic === 'Programming' ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-green-50'}`}>{topic}</div>)
                                            }
                                        </div>
                                    </div>
                                </div>

                            }
                            {
                                <div className="card space-y-2 md:space-y-5 lg:card-side bg-base-100">
                                    <LazyLoadImage className='rounded-2xl object-cover border-primary border  h-60 lg:h-full lg:w-72' src={featured[2]?.img} alt="Movie" />
                                    <div className=" px-5 space-y-3">
                                        <p className="font-semibold text-primary">{featured[2]?.writer} - {`${(parseInt(new Date() - new Date(featured[2]?.date)) / (1000 * 60 * 60)).toFixed(0)} hours ago`}</p>
                                        <h2 className="card-title duration-200 hover:text-primary"> <Link to={`content/${featured[2]?._id}`}>{featured[2]?.title} </Link> </h2>
                                        <p className='leading-7 tracking-wide...'>{`${featured[2]?.description.length > 200 ? `${featured[2]?.description.substring(0, 200)}...` : featured[2]?.description}`}<Link className='text-blue-700'>Read More</Link></p>
                                        <div className="card-actions justify-start">
                                            {
                                                featured[2]?.Topics?.map(topic => <div className={`badge badge-outline ${topic === 'CSS' || topic === 'JavaScript' ? ' text-yellow-700 bg-yellow-50' : topic === 'React' || topic === 'Rest API' || topic === 'Programming' ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-green-50'}`}>{topic}</div>)
                                            }
                                        </div>
                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                </div>
                <div className="all lg:mt-20">
                    <p className="text-xl font-semibold">
                        All blog posts
                    </p>
                    <div className="grid md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
                        <div className="md:grid md:col-span-4 md:grid-cols-2 md:gap-3 lg:col-span-4 grid lg:grid-cols-3 h-full lg:gap-10">
                            {blogs.length > 0 &&
                                blogs?.map((blog, index) =>
                                    <div className="card w-full md:w-80 h-full lg:w-full  my-10" key={index}>
                                        <LazyLoadImage className='rounded-2xl lg:h-60 object-cover border border-primary' src={blog?.img} alt="Shoes" />
                                        <div className="mt-10 lg:space-y-3 lg:h-64 flex flex-col justify-start items-start">
                                            <p className="font-semibold text-primary">{blog?.writer} - {`${(parseInt(new Date() - new Date(blog?.date)) / (1000 * 60 * 60)).toFixed(0)} hours ago`}</p>
                                            <h2 className="card-title duration-200 hover:text-primary">
                                                <Link to={`content/${blog?._id}`}>{blog?.title}</Link>
                                            </h2>
                                            <p className='lg:leading-7 lg:tracking-wide...'>{`${blog?.description.length > 200 ? `${blog?.description.substring(0, 200)}...` : blog?.description}`}<Link className='text-blue-700'> Read More</Link></p>
                                            <div className="card-actions justify-start">
                                                {
                                                    blog.Topics?.map(topic => <div className={`badge badge-outline ${topic === 'CSS' || topic === 'JavaScript' || topic === 'Firestore' || topic === 'Firebase' ? ' text-yellow-700 bg-yellow-50' : topic === 'React' || topic === 'Rest API' || topic === 'Programming' || topic === 'CMS' ? 'text-blue-700 bg-blue-50' : topic === 'ExpressJs' ? 'text-black bg-black bg-opacity-10' : 'text-emerald-700 bg-green-50'}`}>{topic}</div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                        <div className='md:col-span-4 lg:border-l-2 pl-5 lg:col-span-1 lg:mt-10  '>
                            <div className="flex justify-between">
                                <p className='text-2xl lg:text-3xl font-semibold'>{blogs?.length} <br />Posts</p>
                                <p className='text-2xl lg:text-3xl font-semibold'>{writers?.length} <br />Writers</p>
                            </div>
                            <div className="divider"></div>
                            <div className="flex flex-col w-80 lg:w-full">
                                <p className='font-semibold text-xl'>Featured picks</p>
                                <div className="flex flex-col gap-2 mb-10">
                                    {
                                        featured?.map(blog =>

                                            <div className='flex gap-3 justify-center items-start mt-5'>
                                                <div className="avatar">
                                                    <div className="w-20 h-full">
                                                        <LazyLoadImage className='rounded-2xl' src={blog?.img} />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col text-sm w-96'>
                                                    <p className='font-bold'>{blog?.writer}</p>
                                                    <p className='font-semibold'>{blog?.title}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="divider"></div>


                                <p className="font-semibold text-xl">Related TopicsZ</p>
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {
                                        topics?.map(topic => <div className="badge badge-neutral p-3 text-xs">{topic.name}</div>)
                                    }
                                </div>
                                <div className="divider"></div>
                                <p className="font-semibold text-xl">Top Writers</p>
                                <div className="flex flex-col">
                                    {
                                        writers?.map(writer =>
                                            <div className='flex gap-3 justify-center items-center mt-5'>
                                                <div className="avatar">
                                                    <div className="w-10 h-10 rounded-full">
                                                        <LazyLoadImage className='rounded-2xl' src="https://i.ibb.co/DM3jqw5/Profile-avatar-placeholder-large.png" />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col text-xs w-96'>
                                                    <p className='font-bold'>{writer?.writer}</p>
                                                    <p className='font-semibold'>{writer?.description}</p>
                                                </div>
                                                <button className="btn-xs rounded-full btn-primary ">Follow</button>
                                            </div>
                                        )
                                    }

                                    <Link><p className="text-primary text-sm mt-10">See more</p></Link>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <p className='my-5 border border-gray-200'></p>
                {/* <div className="btn-group flex justify-center my-10">

                    <button className="btn btn-outline bg-base-100 hover:bg-secondary hover:text-primary text-primary "><BsFillCaretLeftFill /></button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary btn-active">1</button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary ">2</button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary">3</button>
                    <button className="btn btn-outline bg-base-100 hover:bg-secondary hover:text-primary  text-primary "><BsFillCaretRightFill /></button>
                </div> */}
            </div>

        </div>
    );
};

export default Blog;