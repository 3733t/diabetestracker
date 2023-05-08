import { useEffect, useRef, useState } from 'react'

import './App.css'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'
import Security from './Security'
import { Route, Routes } from 'react-router'
import ResetPassword from './resetPassword'

function App() {

  
  return (<>
    <div className="App">

      <Routes>
        <Route exact path='/' element={<Register />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/security' element={<Security />}></Route>
        <Route exact path='/dashboard' element={<Dashboard />}></Route>
        <Route exact path='/resetpassword' element={<ResetPassword />}></Route>
      </Routes>
    
    
    </div>
    </>
  )
}

export default App
