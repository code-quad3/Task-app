import React from 'react'
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import LgOrSg from './pages/LgOrSg';
import FgpwdPage from './pages/FgpwdPage';
import AddTaskPage from './pages/AddTaskPage';
import TasklistPage from './pages/TasklistPage';
import ReadTaskPage from './pages/ReadTaskPage';
import HomePage from './pages/HomePage';
import OverdueTasklist from './pages/OverdueTasklist';
import UpdtTskPage from './pages/UpdtTskPage';
import CompLstPage from './pages/CompLstPage';
import ProfilePage from './pages/ProfilePage';
import SettngPage from './pages/SettngPage';
function App() {
  

  return (
   <Router>
    <Routes>
    <Route path='/auth' element={<LgOrSg />} />
    <Route path ='/forgot-password' element={<FgpwdPage />} />
    <Route path ='/add-task' element ={<AddTaskPage />} />
    <Route path='/tasks-list' element={<TasklistPage />}/>
    <Route path='/read-task/:taskId' element={<ReadTaskPage apiUrl={'http://localhost:9000/task/read-task'}/>} />
    <Route path='/read-overduetask/:taskId' element={<ReadTaskPage apiUrl={'http://localhost:9000/task/read-overduetask'}/>} />
    <Route path = '/home' element={<HomePage />} />
    <Route path ='/overdue-tasks-list' element={<OverdueTasklist />} />
    <Route path ='/update-task/:taskId' element={<UpdtTskPage fetchapiUrl={'http://localhost:9000/task/read-task'} postapiUrl={'http://localhost:9000/task/update-task'} />} />
    <Route path ='/update-overduetask/:taskId' element={<UpdtTskPage fetchapiUrl={'http://localhost:9000/task/read-overduetask'} postapiUrl={'http://localhost:9000/task/overdue-update-tasks'} />} />
    <Route path ='/complete-history' element ={<CompLstPage />} />
    <Route path='profile' element ={<ProfilePage />} />
    <Route path='settings' element ={<SettngPage />} />
    </Routes>
   </Router>
  )
}

export default App
