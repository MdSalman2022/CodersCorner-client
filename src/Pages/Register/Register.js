import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';


const Register = () => {


    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser, updateUser, providerLogin } = useContext(AuthContext)
    const [signUpError, setSignUpError] = useState('')

    const [createdUserEmail, setCreatedUserEmail] = useState('')

    // const navigate = useNavigate()
    // const location = useLocation()



    // const from = location?.state?.from.pathname || '/'

    const navigate = useNavigate();

    const handleSignUp = data => {
        console.log(data);
        setSignUpError('')
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                toast.success("Successfuuly Registered")
                const userInfo = {
                    displayName: data.name,
                    photoURL: data.photoURL
                }
                updateUser(userInfo)
                    .then(() => {
                        navigate('/')
                        saveUser(data.name, data.email, data.role)
                    })
                    .catch(err => console.log(err))

            })
            .catch(error => {
                console.log(error)
                setSignUpError(error.message)
            })
    }

    const saveUser = (name, email, role) => {
        const user = { name, email, role }
        fetch('https://buyandsell24-server.vercel.app/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                console.log('save user', data)
                setCreatedUserEmail(email)
            })
    }
    const googleSignIn = event => {
        event.preventDefault();
        const Provider = new GoogleAuthProvider();
        providerLogin(Provider)
            .then(result => {
                const user = result.user;
                saveUser(user.displayName, user.email, user.role = "buyer")
            })
            .catch(error => console.error(error))
    }




    return (
        <div className=' my-20'>
            <div className="w-96 p-8 space-y-3 rounded-xl bg-base-200 mx-auto">
                <h1 className="text-3xl font-bold text-center">Register</h1>
                <form onSubmit={handleSubmit(handleSignUp)} novalidate="" action="" className="space-y-6 ng-untouched ng-pristine ng-valid">
                    <div className="space-y-1 text-sm">
                        <label for="username" className="block ">Username</label>
                        <input type="text"
                            {...register("name",
                                { required: "Name is required", })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1 text-sm">
                        <label for="email" className="block ">Email Address</label>
                        <input type="email"
                            {...register("email",
                                { required: "Email is required" })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1 text-sm">
                        <label for="password" className="block ">Password</label>
                        <input type="password"
                            {...register("password",
                                {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be 6 characters long" },
                                    // pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: 'Choose Stronger Password' }
                                })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>
                    <input className='btn btn-accent w-full mt-4' value="Sign Up" type="submit" />
                    {signUpError && <p className='text-red-600'>{signUpError}</p>}

                </form>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
                    <p className="px-3 text-sm text-black">Register with Google</p>
                    <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={googleSignIn} aria-label="Log in with Google" className="p-3 rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                        </svg>
                    </button>

                </div>
                <p className="text-xs text-center sm:px-6 ">Already have an account?
                    <Link to='/login' rel="noopener noreferrer" href="#" className="underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;