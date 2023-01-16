import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';


const WriteBlog = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { user } = useContext(AuthContext)


    const imageHostKey = process.env.REACT_APP_imgbb_key;


    const navigate = useNavigate();

    const handleProductSubmit = data => {
        console.log(data)

        // console.log(data.Topics.split(','))

        const image = data.image[0]
        const formData = new FormData()
        formData.append('image', image)
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgUpload => {
                if (imgUpload.success) {
                    const blog = {
                        title: data.title,
                        description: data.description,
                        Topics: data.Topics.split(','),
                        date: new Date(),
                        img: imgUpload.data.url,
                        writer: data.writer,
                        writerId: data.writerId,
                        categoryName: data.categoryName,
                        categoryId: data.categoryId,
                        featured: false,
                    }
                    console.log(blog);
                    fetch(`${process.env.REACT_APP_SERVER_LINK}/blogs`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(blog)
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(`${blog.title} is added successfully`)
                            navigate('/')
                        }
                        )
                }
            })

    }

    return (
        <div>
            <div className='container mx-auto my-20 rounded-lg'>
                <form onSubmit={handleSubmit(handleProductSubmit)} className=" flex flex-col justify-center items-center space-y-5 ">
                    <div >
                        <label className="label">
                            <span className="label-text pl-3">Writer Name</span>
                        </label>
                        <label className="input">
                            <input className='w-96 h-12 border border-primary rounded-lg px-2' type="text" placeholder="Writer" defaultValue={user.displayName} {...register("writer", { required: true, maxLength: 80 })} readOnly />
                        </label>
                    </div>
                    {/* <input className='w-96 border border-primary rounded-lg px-2' type="text" placeholder="Title" defaultValue={user.displayName} {...register("writer", { required: true, maxLength: 80 })} readOnly /> */}
                    <div >
                        <label className="label">
                            <span className="label-text pl-3">Title</span>
                        </label>
                        <label className="input">
                            <input className='w-96 h-12 border border-primary rounded-lg px-2' type="text" placeholder="12 React hooks every React developer..." {...register("title", { required: true, maxLength: 80 })} />
                        </label>
                    </div>
                    <div >
                        <label className="label">
                            <span className="label-text pl-3">Description</span>
                        </label>
                        <label className="input">
                            <textarea className='w-96 h-12 border border-primary rounded-lg p-2' type="text" placeholder="In this article we are going to be covering..." {...register("description", { required: true })} />
                        </label>
                    </div>
                    <div >
                        <label className="label">
                            <span className="label-text pl-3">Topics</span>
                        </label>
                        <label className="input">
                            <input className='w-96 h-12 border border-primary rounded-lg px-2' type="text" placeholder="React, Programming, Css" {...register("Topics", { required: true })} />
                        </label>
                    </div>
                    <div >
                        <label className="label">
                            <span className="label-text pl-3">Category</span>
                        </label>
                        <label className="input">
                            <input className='w-96 h-12 border border-primary rounded-lg px-2' type="text" placeholder="Category" {...register("categoryName", { required: true })} />
                        </label>
                    </div>
                    <div className=''>
                        <label htmlFor="image" className="block label-text">Blog Image</label>
                        <input type="file"
                            {...register("image",
                                { required: "Photo is required", })}
                            className="file-input file:text-secondary w-full max-w-xs border-2 border-primary" />
                        {errors.img && <p className='text-red-500'>{errors.img.message}</p>}
                    </div>


                    <input className='w-96 border border-primary btn rounded-lg px-2 btn-primary' type="submit" />
                </form>
            </div>
        </div>
    );
};

export default WriteBlog;