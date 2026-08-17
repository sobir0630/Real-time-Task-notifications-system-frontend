import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import Notifcations from "./pages/notifications"

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/notifications" element={<Notifcations />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
