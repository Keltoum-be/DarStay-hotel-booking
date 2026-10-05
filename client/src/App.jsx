import { useState } from 'react'
import Navbar from './Components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './Components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBooking from './pages/MyBooking';
import AIChatbot from './Components/AIChatbot';


function App() {
  const isOwnerPath=useLocation().pathname.includes('owner');

  return (
    <>
    {!isOwnerPath &&<Navbar/> }
    <div className='min-h-[70vh]'>
    <Routes>
      <Route path='/' element={<Home/> }/>
      <Route path='/rooms' element={<AllRooms/> }/>
      <Route path='/rooms/:id' element={<RoomDetails/> }/>
      <Route path='/my-bookings' element={<MyBooking/> }/>

     

   
    </Routes>
    <AIChatbot/>
    <Footer/>
    </div>
   
    </>
  )
}

export default App
