import React from 'react';
import { useEffect, useState } from 'react'; // Assuming you're using these hooks later in your component
import { useNavigate } from 'react-router-dom';
import {app} from '../firebase'; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const Signin = () => {
    const auth = getAuth(app);
    const navigate=useNavigate();
    const [userData,setUser]=useState({});
    const[alert ,setAlert]=useState(false);
    const [alertmessage,setMessage]=useState("");
    const handleChange=(e)=>
    {
        const {name,value}=e.target;
        setUser({...userData,[name]:value});
    }
    const handleSignin=()=>
    {
       console.log(userData);

    signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("user",user);
                setAlert(false);
                navigate('/home')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setMessage(errorMessage);
                setAlert(true);
                });

   
       
    }
    return (
        <div className="w-screen h-screen  flex flex-row justify-center items-center bg-gradient-to-r from-cyan-200 to-emerald-500 ">
            <div className="w-1/2 h-full md:visible">
                <img src="https://images.prismic.io/smarttask%2F814e7d0f-a5f5-451d-bdc1-b5256b583219_why+task+management+tool+works+for+me+and+not+for+you.gif" className='w-full h-full'></img>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center items-center ">
            {alert&&<div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span class="font-medium">Try Again!</span>{alertmessage}
            </div>}
                 <h1 className='text-white font-extrabold' >Task Management App </h1>
                 {/* form section for registeration */}
                 
                 <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 bg-blend-lighten">

                 <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                <div>
               <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
               <input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
                onChange={(e)=>{handleChange(e)}}/>
               </div>
                    <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={userData.password}
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        onChange={(e)=>{handleChange(e)}}
                    />
                    </div>
                    
                    <div className="flex items-start">
                    
                    <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button
                    type="submit"
                    className="w-full mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSignin}
                    >
                    Login to your account
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Not registered? <a href="http://localhost:3000/register" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                    </div>
                    </div>

            </div>
        </div>
    );
};

export default Signin;
