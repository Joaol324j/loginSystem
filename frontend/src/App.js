import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ResetPassword from './components/Auth/ResetPassword'
import NewPassword from './components/Auth/NewPassword'
import PrivateRoute from './components/Routing/PrivateRoute'
import PublicRoute from './components/Routing/PublicRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/login' element={<PublicRoute element={<Login />} />} />
        <Route path='/register' element={<PublicRoute element={<Register />} />} />
        <Route path='/reset-password' element={<PublicRoute element={<ResetPassword />} />} />
        <Route path='/reset-password/:token' element={<PublicRoute element={<NewPassword />} />} />
        <Route path='*' element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
