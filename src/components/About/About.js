import React from 'react';

const About = () => {
    return (
        <div className=' '>
            <div className="bg-accent">
                <div className="flex justify-center items-center  py-10 container mx-auto ">
                    <div>
                        <h1 className="text-5xl drop-shadow-lg">Know your audience</h1>
                        <p className="text-lg drop-shadow-xl">Find out which posts are a hit with Blogger’s built-in analytics. You’ll see where your audience is coming from and what they’re interested in. You can even connect your blog directly to Google Analytics for a more detailed look.</p>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/5L5hqj8/analysis.png" alt="" />
                    </div>

                </div>
            </div>
            <hr />
            <div className="bg-base-100">
                <div className="flex justify-center items-center  py-10 container mx-auto   ">
                    <div>
                        <img src="https://i.ibb.co/jwj0q9k/store.png" alt="" />
                    </div>
                    <div>
                        <h1 className="text-5xl drop-shadow-lg">Hang onto your memories</h1>
                        <p className="text-lg drop-shadow-lg">Save the moments that matter. Blogger lets you safely store thousands of posts, photos, and more with Google.</p>
                    </div>
                </div>
            </div>

            <hr />
            <div className="bg-accent">
                <div className="flex justify-center items-center  py-10 container mx-auto">
                    <div>
                        <h1 className="text-5xl drop-shadow-lg">Join millions of others</h1>
                        <p className="text-lg drop-shadow-lg">Whether sharing your expertise, breaking news, or whatever’s on your mind, you’re in good company on Blogger. Sign up to discover why millions of people have published their passions here.</p>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/RBbkLmq/community.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;