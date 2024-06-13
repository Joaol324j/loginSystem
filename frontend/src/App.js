import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ResetPassword from './components/Auth/ResetPassword'
import NewPassword from './components/Auth/NewPassword'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/reset-password' element={<ResetPassword />}></Route>
        <Route path='/reset-password/:token' element={<NewPassword />}></Route>
        <Route path='*' element={<Navigate to="/login" />}></Route>
      </Routes>
    </Router>
  )
}

export default App
