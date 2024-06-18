import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ element }) => {
    const token = localStorage.getItem('token')

    return token ? <Navigate to = "/home" /> :element
}

export default PublicRoute