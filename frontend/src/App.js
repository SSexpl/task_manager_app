import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/register";
import Signin from './pages/signin';
import Home from './pages/home';
import TaskDetails from './pages/task';
import NewTaskForm from './pages/newTask';
export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signin/>}></Route>
      <Route path="/register" element ={<Register/>}></Route>
      <Route path="/home" element ={<Home/>}></Route>
      <Route path="/task/:taskId" element={<TaskDetails/>} />
      <Route path="/newTask" element={<NewTaskForm/>} />
    </Routes>
  </BrowserRouter>
  )
}