import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0e0e0;
`;

const ResetBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const NewPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {

    e.preventDefault()
    setMessage('')
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não conferem!')
      return
    }

    try {

      const response = await axios.post(`https://loginsystem-o5b9.onrender.com/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      })

      if (response.status === 200) {
        setMessage('Senha redefinida com sucesso!')
        navigate('/login')
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg)
      } else {
        setError('Erro no servidor, tente novamente mais tarde!')
      }
    }

  }

  return (

    <Container>
      <ResetBox>

        <Title>Redefinir Senha</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Nova Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirme a Nova Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {message && <p>{message}</p>}
          {error && <p>{error}</p>}
          <Button type="submit">Redefinir Senha</Button>
        </form>

      </ResetBox>
    </Container>
  )
}

export default NewPassword
