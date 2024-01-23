// TaskDetails.js

import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import { app, db } from '../firebase'; // Import your Firebase configuration
import { onAuthStateChanged,getAuth } from 'firebase/auth';
import { doc,query,where, onSnapshot,collection ,getDocs,getDoc,addDoc} from "firebase/firestore";
import AssignCard from '../components/AssignedBox';
import CommentCards from '../components/CommentCard';
const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [taskAssigned,setAssigned]=useState([]);
  const [comments,setCommnents]=useState([]);
  const [allUsers,setAll]=useState([]);
  const [currentComment,setcurrentComment]=useState("");
  const [user,setUser]=useState(null);
  console.log(taskId);
  const navigate=useNavigate();
  const fetchTaskDetails = async () => {
    // Assuming 'tasks' is the collection name
  // const tId="KAlpSQtVZ4JO2NSLoIi9";
    const docRef= doc(db, "tasks",taskId);
    console.log(docRef);
    try {
      const taskDoc = await getDoc(docRef);
      console.log(taskDoc)
      console.log(taskDoc.data());
   //  console.log(taskDoc.map(task =>task.data()));
      if (taskDoc.data()) {
        setTask(taskDoc.data());
        console.log("task",task);
      } else {
        console.log('Task not found');
      }
    } catch (error) {
      console.error('Error fetching task details: ', error);
    }
  };
 const getAssigned =async()=>
 {
    const colRef=collection(db,"user_task_map");

    const q=query(colRef,where("tid","==",taskId));
    const querySnapshot = await getDocs(q);
    const temp=[];
 querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  temp.push(doc.data());
});

  setAssigned(temp);
  console.log(taskAssigned);
 }
 const getComments=async()=>
{
    const colRef=collection(db,"comments");
    const q=query(colRef,where("tid","==",taskId));
    const querySnapshot = await getDocs(q);
    const temp=[];
    querySnapshot.forEach((doc) => {
     // doc.data() is never undefined for query doc snapshots
     temp.push(doc.data());
   });
   setCommnents(temp);
}
const getUsers=async ()=>
{
    const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  const temp=[];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id);
    temp.push(doc.data());

  
  });
  const filteredTemp = temp.filter(tempItem => !taskAssigned.some(crossItem => crossItem.uemail === tempItem.email));
  console.log(temp);
  setAll(filteredTemp);
}
  useEffect(() => {
    // Fetch task details from Firestore based on the taskId parameter
    
    fetchTaskDetails();
    getAssigned();
    getComments();
    getUsers();
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
  }, [taskId]);

 const handleAssign =async(user)=>
 {
      console.log(user);
      
      const docRef = await addDoc(collection(db, "user_task_map"), {
        uemail:user.email,uname:user.name,tid:taskId
       
     });
     console.log(docRef);
 }
 const handleCommentSubmit = async() => {
    // Handle the comment submission logic here
    console.log('Comment submitted:', currentComment);
    const currentTimestamp = new Date().getTime();
    const docRef = await addDoc(collection(db, "comments"), {
        uemail:user.email,comment:currentComment,tid:taskId,time:currentTimestamp
       
     });
    // Clear the textarea after submission
    setcurrentComment('');
    window.location.reload();
  };
  if(!task)
  {
    return(<div className='bg-black w-screen h-screen text-white'>Loading..</div>);
  }
  return (
    <div className="h-screen w-screen bg-gray-900 text-white p-8 flex flex-row">
      <div className=" w-2/3 h-full overflow-auto p-2">
       
          
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            <div className="mb-4">
              <p>{task.description}</p>
            </div>
            <div className="flex items-center mb-4">
              <p className="mr-2">Due Date:</p>
              <p>{task.dueDate.toDate().toString()}</p>
            </div>
            <div className="flex items-center mb-4">
              <p className="mr-2">Created By:</p>
              <p>{task.createdBy}</p>
            </div>
            <div className="flex items-center mb-4">
              <p className="mr-2">Completion Status:</p>
              <p>{task.completionStatus}</p>
            </div>
        <div className='w-full'>
            {taskAssigned && (
              <div class="w-full h-1/3 mb-2 max-w-md p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div class="flex items-center justify-between mb-4">
                  <h5 class="text-md font-bold leading-none text-gray-900 dark:text-white">Assigned To</h5>
                 
             </div>
                  {/* Assuming 'users' is the collection name for users */}
                  {taskAssigned.map((user,index) => (
                    <AssignCard name={user.uname} email={user.uemail}/>
                  ))}
              </div>
            )}

            {comments && (
              <div class=" mb-2 w-full h-1/4 overflow-auto p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div class="flex items-center justify-between mb-4">
                  <h5 class="text-md font-bold leading-none text-gray-900 dark:text-white">Comments</h5>
                 
             </div>
                  {/* Assuming 'users' is the collection name for users */}
                
                  {
                  comments.map((comment,index) => (
                    <CommentCards name={comment.uname} email={comment.uemail} comment={comment.comment} time={comment.time}/>
                  ))}
              </div>
            )}
          
          </div>
      </div>
      <div className='bg-blue-700 w-1/3 h-full'>
      <div class="relative overflow-x-auto shadow-md sm:h-2/3">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-2 py-3">
                    Name
                </th>
                <th scope="col" class="px-2 py-3">
                    Email 
                </th>
                <th scope="col" class="px-2 py-3">
                   Assign
                </th>
               
            </tr>
        </thead>
        <tbody>
                {allUsers.map((user, index) => (
        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {user.name} {/* Replace with the actual property from your user object */}
            </th>
            <td className="px-2 py-4">
            {user.email} {/* Replace with the actual property from your user object */}
            </td>
            <td className="px-2 py-4">
            <button type="button" 
    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full 
    text-sm px-2 py-2.5 text-center me-2 mb-2 dark:bg-blue-600
     dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>handleAssign(user)}>Assign</button>
            </td>
        </tr>
        ))}
            </tbody>
            </table>
      </div>
      <div className='w-full h-1/3'>
        <h1>Comments</h1>
      <div class="mb-6">
      <textarea
      id="description"
      rows="3"
      className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
      value={currentComment}
      onChange={(e)=>{setcurrentComment(e.target.value)}}
    ></textarea>
    <button type="button" class="text-white bg-gray-800
     hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg 
     text-sm px-5 py-2.5 me-2  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700
      dark:border-gray-700" onClick={()=>handleCommentSubmit()}>Comment</button>

</div>
      </div>
    </div>
    </div>
  );
};

export default TaskDetails;
