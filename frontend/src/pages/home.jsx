import React from 'react';
import { useEffect, useState } from 'react'; // Assuming you're using these hooks later in your component
import { useNavigate } from 'react-router-dom';
import {app,db} from '../firebase'; 
import {getAuth,onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import Dropdown from '../components/dropdown';
import { doc,query,where, onSnapshot,collection ,getDocs} from "firebase/firestore";
const Home=()=>
{
    const auth = getAuth(app);
    const navigate=useNavigate();
    const [userData,setUser]=useState(null);
    const [tasks, setTasks] = useState([ ]);
    
      // Filter and sort options
      const [searchTerm, setSearchTerm] = useState('');
      const [type,setType]=useState('all');
      const [sortBy, setSortBy] = useState('title');
      const [userTask,setUserTask]=useState("myTask");
     const handlefunctionSort=(value)=>
    { 
        console.log(value);
        setSortBy(value);
    }
    const handlefunctionType=(value)=>
    {
        console.log(value);
        setType(value);
    }
    const handlefunctionUserTask=(value)=>
    {
      setUserTask(value);
    }
      const TaskList = ({ tasks }) => {
        return (
           
 <div class="w-full relative overflow-x-auto shadow-md sm:rounded-lg ">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Your Tasks : 
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
        </caption>
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    title
                </th>
                <th scope="col" class="px-6 py-3">
                    Description
                </th>
                <th scope="col" class="px-6 py-3">
                    Completion Percentage
                </th>
                <th scope="col" class="px-6 py-3">
                    Created By
                </th>
                <th scope="col" class="px-6 py-3">
                    Due Date
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">View</span>
                </th>
            </tr>
        </thead>
        <tbody>
        {tasks.map((task, index) => (
  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      {task.title}
    </th>
    <td className="px-6 py-4">
    {task.description.split(' ').slice(0, 50).join(' ')}
    </td>
    <td className="px-6 py-4">
      {task.completionStatus}
    </td>
    <td className="px-6 py-4">
      {task.createdBy}
    </td>
    <td className="px-6 py-4">
     {task.dueDate.toDate().toString()}
     
    </td>
    
    <td className="px-6 py-4 text-right">
    <button type="button" 
    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
     focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
      dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
       dark:focus:ring-blue-800" onClick={()=>handleNavigation(task.id)}> View</button>
    </td>
  </tr>
))}
        </tbody>
    </table>
</div>

        
);
};

// to fecth the data from the backend 
const fetch=async()=>
{
  const q = query(collection(db, "tasks"));
  const querySnapshot = await getDocs(q);
  const temp=[];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
   let current={};
    current={id:doc.id,...doc.data()};
    //console.log(doc.id);
    temp.push(current);
  
  });
  console.log(temp);
  setTasks(temp);
  

   // console.log("Current cities in CA: ", cities.join(", "));

  
}
        //monitors the state of the user currently.
        useEffect(() => {
            const auth = getAuth();
            fetch();
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              if (user) {
                // User is signed in
                setUser(user);
              } else {
                // User is signed out
                setUser(null);
                navigate('/')
              }
            });
        
            // Cleanup the subscription when the component unmounts
            return () => unsubscribe();
          }, []); 


     const handleLogout=()=>
     {
        signOut(auth).then(() => {
            // Sign-out successful.
          console.log("signing out")
          }).catch((error) => {
            // An error happened.
            console.log(error);
          });
     }
     const handleNavigation =(id)=>
     {
      console.log(id);
    navigate(`/task/${id}`)
     }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <header className="bg-blue-500 p-4 text-white text-center flex flex-row justify-between items-center">
          <div> <h1 className="text-2xl font-bold">Task Management App</h1></div> 
          <div>{userData&& <div className="mt-2">Hello, {userData.email} </div>}</div> 
            <div >
            <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleLogout()}>Log Out</button>

            <button type="button" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => navigate('/newTask')}>New Task</button>
            </div>
        
          </header>
    
          <div className="flex flex-col lg:flex-col">
            <div className="w-full p-2 bg-gray-200  left-0 top-0 h-full overflow-y-visible z-10">
              {/* Filter and search panel */}
              <div className="flex flex-row justify-between items-center">
                        
                        <form className='w-1/5'>   
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required></input>
                                <button type="submit" className="w-15 text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>

                       <div>Sort By <Dropdown value={sortBy} handlefunction={handlefunctionSort} options={["date","title"]}/></div>
                       <div>Type<Dropdown value={type} handlefunction={handlefunctionType} options={["All","Active","Completed","Overdue"]}/></div>
                       <div>Type<Dropdown value={userTask} handlefunction={handlefunctionUserTask} options={["myTasks","AssignedTask"]}/></div>
              </div>
              {/* Additional filter options go here */}
            </div>
    
          {tasks.length&&  <div className="w-full flex  p-4 overflow-y-auto relative">
              {/* Task list component */}
              <TaskList tasks={tasks} />
            </div>
       }
          </div>
   
        </div>
  );
}
export default Home;