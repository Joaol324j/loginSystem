import React, { useState } from 'react'
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

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('https://loginsystem-o5b9.onrender.com/api/auth/reset-password', { email })

      if (response.status === 200) {
        setMessage('Email de redefinição de senha enviado com sucesso!')
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg)
      } else {
        setError('Erro no servidor, tente novamente mais tarde!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <ResetBox>

        <Title>Redefinir Senha</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p>{message}</p>}
          {error && <p>{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : 'Enviar'}
          </Button>
        </form>

      </ResetBox>
    </Container>
  )
}

export default ResetPasswordRequest
