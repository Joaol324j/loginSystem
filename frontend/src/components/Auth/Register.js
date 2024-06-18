import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0e0e0;
`;

const LoginBox = styled.div`
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

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #333;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
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


const Register = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)
    setError('')

    if(password !== confirmPassword){
      setError('As senhas não conferem!')
      return
    }

    try {
      const response = await axios.post('https://loginsystem-o5b9.onrender.com/api/auth/register', {
        username,
        email,
        password,
        confirmPassword
      })

      if(response.status === 201){
        navigate('/login')
      }

    } catch (err) {

      if(err.response && err.response.data){
        setError(err.response.data.msg)
      } else{
        setError('Erro no servidor, tente novamente mais tarde!')
      }

    }
  }

  return (
    <Container>
      <LoginBox>
        <Title>Cadastro</Title>
        <form onSubmit={handleSubmit}>

          <Input 
            type='text'
            placeholder='Nome do usuário'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>

          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required />
          
          <Input 
            type="password" 
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />

          <Input 
            type='password'
            placeholder='Confirme sua senha'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

            {error && <p>{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : 'Cadastro'}
            </Button>

        </form>

        <RegisterLink onClick={() => navigate ('/login')}>
          Já possui uma conta? Faça o login aqui
        </RegisterLink>
      </LoginBox>
    </Container>

  )
}

export default Register