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

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await axios.post('https://loginsystem-o5b9.onrender.com/api/auth/login', {email, password})
            if(response.status === 200){
                const { token } = response.data
                localStorage.setItem('token', token)
                navigate('/home')
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
            <Title>Login</Title>
            <form onSubmit={handleSubmit}>

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

                {error && <p>{error}</p>}

              <Button type="submit">Login</Button>

            </form>

            <RegisterLink onClick={() => navigate('/register')}>
              Não tem uma conta? Registre-se aqui
            </RegisterLink>
            <RegisterLink onClick={() => navigate('/reset-password')}>
              Esqueceu a senha?
            </RegisterLink>
            
          </LoginBox>
        </Container>
      )
    }

export default Login