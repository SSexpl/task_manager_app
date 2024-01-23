// NewTaskForm.js

import React, { useEffect ,useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {app,db} from '../firebase'; 
import {getAuth,onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {doc,addDoc,collection } from 'firebase/firestore';
const NewTaskForm = ({ onCreateTask }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate=useNavigate();
  const [user,setUser]=useState(null);

  const onSubmit = async(data) => {
    // Pass the form data to the parent component for further processing (e.g., saving to Firebase)
    const currentTimestamp = new Date().getTime();
   data={...data ,completionPercentage:0 ,completionStatus:"Incomplete",createdDate:currentTimestamp};
    console.log(data);
    const docRef = await addDoc(collection(db, "tasks"), {
       ...data
      
    });
      console.log(docRef.id);

  };


  useEffect(() => {
    const auth = getAuth();
   
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log(user);
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
        navigate('/home')
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); 
  if(!user)
  {
    return(<div className='bg-black w-screen h-screen text-white'>Loading..</div>)
  }
  return (
    <div className='bg-gray-800 flex flex-row w-screen h-screen'>
    <div className='bg-blue-700 p-5 h-full text-white w-1/3'>
        <h1>Welcome User </h1>
        {user&&<h1 className="text-2xl font-bold mb-4 text-white">{user.email}</h1>}
    </div>
    <div className='bg-gray-800 h-full w-2/3 overflow-y-auto'>
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-gray-800 p-4 rounded-md">
  <h1 className="text-2xl font-bold mb-4 text-white">Create New Task</h1>

  <div className="mb-2">
    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
      Title
    </label>
    <input
      type="text"
      {...register('title', { required: 'Title is required' })}
      id="title"
      className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
    />
    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
  </div>

  <div className="mb-2">
    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
      Description
    </label>
    <textarea
      {...register('description', { required: 'Description is required' })}
      id="description"
      rows="3"
      className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
    ></textarea>
    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
  </div>

  <div className="mb-2">
    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">
      Due Date
    </label>
    <Controller
      control={control}
      name="dueDate"
      render={({ field }) => (
        <DatePicker
          {...field}
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
        />
      )}
      rules={{ required: 'Due Date is required' }}
    />
    {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
  </div>

  <div className="mb-2">
    <label htmlFor="createdByUserId" className="block text-sm font-medium text-gray-300">
      Creator Email
    </label>
    <input
      type="text"
      {...register('createdBy', { required: 'Created By User ID is required' })}
      id="createdBy"
      className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
      value={user.email}
    />
    {errors.createdBy && (
      <p className="text-red-500 text-sm">{errors.createdByUserId.message}</p>
    )}
  </div>

 

  <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
    Create Task
  </button>
</form>

    </div>
    </div>
  );
};

export default NewTaskForm;
