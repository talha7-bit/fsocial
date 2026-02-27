import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './components/Home'
import Feed from './pages/Feed'
import Userinfo from './pages/Userinfo'
import Navbar from './pages/Navbar'
import UploadPage from './pages/Upload'
import { useAuth } from './hooks/useAuth'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify"

function App() {
  const [count, setCount] = useState(0)

  const {data:user,isLoading,isError}=useAuth();
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1500} // 3 seconds
        //hideProgressBar={false}
        //newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // light | dark | colored
      />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed/>}/>
        <Route path='/info' element={user==200 ? <Userinfo/> : <Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/upload' element={<UploadPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
