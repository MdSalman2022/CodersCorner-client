import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import { ImLinkedin2 } from 'react-icons/im';
import { MdOutlineContentCopy } from 'react-icons/md';
import { BsClipboardCheck } from 'react-icons/bs';


const ContentPage = () => {

    const { user } = useContext(AuthContext)

    const [writerInfo, setWriterInfo] = useState('')
    const content = useLoaderData();

    const { title, description, Topics, date, img, writer, writerId, categoryName, categoryId, featured, photoURL } = content;

    console.log(title)

    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_LINK}/writers/${writerId}`)
            .then(res => res.json())
            .then(data => setWriterInfo(data))
    }, [writerId])
    console.log(writerInfo);

    const [copied, setCopied] = useState(false);
    const url = window.location.href;

    const handleClick = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
    };

    const handleShareFb = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, 'facebook-share-dialog', 'width=800,height=600');
    };

    return (
        <div>
            <div className="container mx-auto">

                <p className=' text-center font-semibold text-primary mt-10'>{`Published ${(new Date(date).getDate())} ${(monthNames[(new Date(date).getMonth())])}`} {(new Date(date).getFullYear())}</p>
                <h1 className='text-4xl font-semibold text-center my-10'>{title}</h1>
                <div className="text-center my-10">
                    {
                        Topics?.map(topic => <div className={`badge badge-outline mx-2 ${topic === 'CSS' || topic === 'JavaScript' ? ' text-yellow-700 bg-yellow-50' : topic === 'React' || topic === 'Rest API' || topic === 'Programming' ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-green-50'}`}>{topic}</div>)
                    }
                </div>

                <div className='w-full flex justify-center mb-10'>
                    <img className='w-[900px] h-[500px] object-fill' src={img} alt="" />
                </div>

                <p className='text-center text-primary my-5 text-2xl'><span className='font-semibold'>{categoryName}</span></p>
                <div className='lg:w-[900px]  mx-auto '>
                    <p className='  text-left leading-9 text-lg tracking-wider'>{description}</p>
                    <br />
                    <hr />
                    <div className="flex  my-10  justify-between">
                        <div className='flex  gap-3 items-center'>
                            <div className="avatar">
                                <div className="w-14 h-14 rounded-full">
                                    <img src={photoURL ? photoURL : "https://i.ibb.co/DM3jqw5/Profile-avatar-placeholder-large.png"} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className='text-left '><span className='font-semibold'>{writerInfo.writer}</span></p>
                                <p className='text-left '><span className=''>{writerInfo.description}</span></p>
                            </div>

                        </div>
                        <div className="social flex items-center gap-5">
                            <button className='py-2 px-5  rounded-lg items-center font-semibold border' onClick={handleClick}>
                                {copied ? <span className='w-full flex gap-2 '><BsClipboardCheck className='text-xl' /> Copied!</span> : <span className='w-full flex gap-2 '><MdOutlineContentCopy className='text-xl' />  Copy LINK</span>}
                            </button>
                            <p className='p-2 rounded-lg border-2 border-secondary text-neutral'><ImLinkedin2 /></p>
                            <p className='p-2 rounded-lg border-2 border-secondary text-neutral'><FaTwitter /></p>
                            <button onClick={handleShareFb}>
                                <p className='p-2 rounded-lg border-2 border-secondary text-neutral'><FaFacebookF /></p>
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContentPage;