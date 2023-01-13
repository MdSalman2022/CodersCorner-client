import React from 'react';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

const Blog = () => {
    return (
        <div className='bg-base-100 mt-10'>
            <div className="container mx-auto">
                <div className="recent">
                    <p className="text-xl font-semibold">
                        Recent blog posts
                    </p>

                    <div className="grid grid-cols-2 gap-10">
                        <div className="card w-full h-96 my-10">
                            <img className='rounded-2xl' src="https://placeimg.com/800/400/arch" alt="Shoes" />
                            <div className=" mt-5 space-y-2">
                                <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                <h2 className="card-title flex justify-between">
                                    <p> Top 10 Javascript Frameworks to use </p> <Link className='hover:text-primary'><RxOpenInNewWindow /></Link>
                                </h2>
                                <p>JavaScript frameworks make development easy with extensive features and <functionalities /></p>
                                <div className="card-actions justify-start">
                                    <div className="badge badge-outline text-emerald-700 bg-emerald-50">Frameworks</div>
                                    <div className="badge badge-outline text-blue-700 bg-blue-50">React</div>
                                    <div className="badge badge-outline text-yellow-700 bg-yellow-50">JavaScript</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 my-10">
                            <div className="card card-side bg-base-100">
                                <img className='rounded-2xl' src="https://placeimg.com/350/200/arch" alt="Movie" />
                                <div className=" px-5 space-y-3">
                                    <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                    <h2 className="card-title">React, Vite and TypeScript: Get started in under 2 minutes</h2>
                                    <p className='leading-7 tracking-wide...'>Let’s be honest. Dealing with tooling is not something enjoyable if you have to deliver code. It should just work and not be in the way. So let’s...</p>
                                    <div className="card-actions justify-start">
                                        <div className="badge badge-outline text-pink-700 bg-pink-50">React</div>
                                        <div className="badge badge-outline text-blue-700 bg-blue-50">TypeScript</div>
                                        <div className="badge badge-outline text-yellow-700 bg-yellow-50">Vite</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-side bg-base-100">
                                <img className='rounded-2xl' src="https://placeimg.com/350/200/arch" alt="Movie" />
                                <div className=" px-5 space-y-3">
                                    <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                    <h2 className="card-title">Mastering useContext: A Deep Dive into React’s Context API</h2>
                                    <p className='leading-7 tracking-wide'>Today we will be discussing the use of the useContext hook in React, which allows for the efficient sharing of data across components and...</p>
                                    <div className="card-actions justify-start">
                                        <div className="badge badge-outline text-pink-700 bg-pink-50">useContext</div>
                                        <div className="badge badge-outline text-blue-700 bg-blue-50">React</div>
                                        <div className="badge badge-outline text-yellow-700 bg-yellow-50">Tools</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="all mt-10">
                    <p className="text-xl font-semibold">
                        All blog posts
                    </p>
                    <div className="grid grid-cols-5 gap-5">
                        <div className="col-span-4 grid grid-cols-3 h-full gap-10">
                            <div className="card w-full  my-10">
                                <img className='rounded-2xl' src="https://placeimg.com/400/225/arch" alt="Shoes" />
                                <div className="mt-10 space-y-3 h-64 flex flex-col justify-start items-start">
                                    <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                    <h2 className="card-title">
                                        Front End Principles & Architecture
                                    </h2>
                                    <p>Introduction To tell you a little bit about my history and how I got here, I first started my career as a High School Math Teacher and Lacrosse Coach and also ran multiple lacrosse camps for kids. I eventually ma... <functionalities /></p>
                                    <div className="card-actions">
                                        <div className="badge badge-outline text-emerald-700 bg-emerald-50">Frameworks</div>
                                        <div className="badge badge-outline text-blue-700 bg-blue-50">React</div>
                                        <div className="badge badge-outline text-yellow-700 bg-yellow-50">JavaScript</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card w-full  my-10">
                                <img className='rounded-2xl' src="https://placeimg.com/400/225/arch" alt="Shoes" />
                                <div className="mt-10 space-y-3 h-64 flex flex-col justify-start items-start">
                                    <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                    <h2 className="card-title">
                                        Optimizing React Functional Components for Lightning-Fast Performance
                                    </h2>
                                    <p>React is a popular JavaScript library for building user interfaces, and optimizing the performance of a React application can help ensure that...<functionalities /></p>
                                    <div className="card-actions justify-start">
                                        <div className="badge badge-outline text-emerald-700 bg-emerald-50">Frameworks</div>
                                        <div className="badge badge-outline text-blue-700 bg-blue-50">React</div>
                                        <div className="badge badge-outline text-yellow-700 bg-yellow-50">JavaScript</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card w-full  my-10">
                                <img className='rounded-2xl' src="https://placeimg.com/400/225/arch" alt="Shoes" />
                                <div className="mt-10 space-y-3 h-64 flex flex-col justify-start items-start">
                                    <p className="font-semibold text-primary">Olivia Rhye - 20 Jan 2022</p>
                                    <h2 className="card-title">
                                        Learn Everything about React Hooks in 10 Mins
                                    </h2>
                                    <p>Become a React Hooks Master Today we’ll be going to learn everything about React Hooks and all of their types. This is going to be a fun ride. So, let’s keep going. React Hooks are functions that allow you to use... <functionalities /></p>
                                    <div className="card-actions justify-start">
                                        <div className="badge badge-outline text-emerald-700 bg-emerald-50">Frameworks</div>
                                        <div className="badge badge-outline text-blue-700 bg-blue-50">React</div>
                                        <div className="badge badge-outline text-yellow-700 bg-yellow-50">JavaScript</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='border-l-2 pl-5 col-span-1 mt-10'>
                            <div className="flex justify-between">
                                <p className='text-3xl font-semibold'>10k <br />Posts</p>
                                <p className='text-3xl font-semibold'>2k <br />Writers</p>
                            </div>
                            <div className="divider"></div>
                            <div className="flex flex-col">
                                <p className='font-semibold text-xl'>Featured picks</p>
                                <div className="flex flex-col gap-2 mb-10">
                                    <div className='flex gap-3 justify-center items-start mt-5'>
                                        <div className="avatar">
                                            <div className="w-5 h-5 rounded-full">
                                                <img className='rounded-2xl' src="https://placeimg.com/192/192/people" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-sm w-96'>
                                            <p className='font-bold'>John Doe</p>
                                            <p className='font-semibold'>How to become a front-end developer in 2023?</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-3 justify-center items-start mt-5'>
                                        <div className="avatar">
                                            <div className="w-5 h-5 rounded-full">
                                                <img className='rounded-2xl' src="https://placeimg.com/192/192/people" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-sm w-96'>
                                            <p className='font-bold'>John Doe</p>
                                            <p className='font-semibold'>How to become a front-end developer in 2023?</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-3 justify-center items-start mt-5'>
                                        <div className="avatar">
                                            <div className="w-5 h-5 rounded-full">
                                                <img className='rounded-2xl' src="https://placeimg.com/192/192/people" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-sm w-96'>
                                            <p className='font-bold'>John Doe</p>
                                            <p className='font-semibold'>How to become a front-end developer in 2023?</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>


                                <p className="font-semibold text-xl">Related Topics</p>
                                <div className="flex flex-wrap gap-2 mb-10">
                                    <div className="badge badge-neutral p-3 text-xs">JavaScript</div>
                                    <div className="badge badge-neutral p-3 text-xs">React</div>
                                    <div className="badge badge-neutral p-3 text-xs">Programming</div>
                                    <div className="badge badge-neutral p-3 text-xs">Software Development</div>
                                    <div className="badge badge-neutral p-3 text-xs">TypeScript</div>
                                    <div className="badge badge-neutral p-3 text-xs">C++</div>
                                    <div className="badge badge-neutral p-3 text-xs">Java</div>
                                    <div className="badge badge-neutral p-3 text-xs">C#</div>
                                </div>
                                <div className="divider"></div>
                                <p className="font-semibold text-xl">Top Writers</p>
                                <div className="flex flex-col">
                                    <div className='flex gap-3 justify-center items-center mt-5'>
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-full">
                                                <img className='rounded-2xl' src="https://placeimg.com/192/192/people" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-xs w-96'>
                                            <p className='font-bold'>John Doe</p>
                                            <p className='font-semibold'>Hi friends, I am a front-end engineer from Alibaba, let’s</p>
                                        </div>
                                        <button className="btn-xs rounded-full btn-primary ">Follow</button>
                                    </div>
                                    <div className='flex gap-3 justify-center items-center mt-5'>
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-full">
                                                <img className='rounded-2xl' src="https://placeimg.com/192/192/people" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-xs w-96'>
                                            <p className='font-bold'>John Doe</p>
                                            <p className='font-semibold'>Hi friends, I am a front-end engineer from Alibaba, let’s</p>
                                        </div>
                                        <button className="btn-xs rounded-full btn-primary ">Follow</button>
                                    </div>
                                    <Link><p className="text-primary text-sm mt-10">See more</p></Link>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <p className='my-5 border border-gray-200'></p>
                <div className="btn-group flex justify-center my-10">
                    <button className="btn btn-outline bg-base-100 hover:bg-secondary hover:text-primary text-primary "><BsFillCaretLeftFill /></button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary btn-active">1</button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary ">2</button>
                    <button className="btn bg-base-100 hover:bg-secondary border-primary hover:text-primary text-primary">3</button>
                    <button className="btn btn-outline bg-base-100 hover:bg-secondary hover:text-primary  text-primary "><BsFillCaretRightFill /></button>
                </div>
            </div>

        </div>
    );
};

export default Blog;