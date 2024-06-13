import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`

const Home = () => {

  const navigate = useNavigate()

  const handleLogout = async () => {

    const token = localStorage.getItem('token')

    try {
      await axios.post('https://loginsystem-o5b9.onrender.com/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      localStorage.removeItem('token')
      navigate('/login')
    } catch (err) {
      console.error('Erro ao fazer o logout', err)
    }

  }
  return (
    <>
    <h1>Bem-Vindo à página Home!</h1>
    <Button onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default Home