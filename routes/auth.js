const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const router = express.Router()
const createTransporter = require('../nodemail')

router.post('/register', async (req, res) => {

    const { username, email, password, confirmPassword } = req.body

    if(!username){
        return res.status(422).json({ msg: 'O nome é obrigatório!' })
    }

    if(!email){
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }

    if(!password){
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }

    if(password != confirmPassword){
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    const userExists = await User.findOne({ username: username })

    if(userExists){
        return res.status(422).json({ msg: 'Por favor, utilize outro nome de Usuário' })
    }

    const emailExists = await User.findOne({ email: email })

    if(emailExists){
        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail' })
    }


    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        email,
        password: passwordHash,
    })

    try {

        await user.save()

        res.status(201).json({ msg: 'Usuário criado com sucesso!' })
        
    } catch (err) {

        console.log(err)
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })

    }

})

router.post('/login', async (req, res) => {

    const { email, password } = req.body

    if(!email){
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }

    if(!password){
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }

    const user = await User.findOne({ email: email })

    if(!user){
        return res.status(404).json({ msg: 'Email não encontrado!' })
    }

    const checkPass = await bcrypt.compare(password, user.password)

    if(!checkPass){
        return res.status(422).json({ msg: 'Senha Inválida!' })
    }


    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id,

            }, 
            secret,
        )

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
        
    } catch (err) {

        console.log(err)
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })

    }

})

let blacklist = []

const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    if (blacklist.includes(token)) {
        return res.status(401).json({ msg: 'Token inválido!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido!' })
    }

}

router.post('/logout', authMiddleware, (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
        blacklist.push(token)
    }

    res.status(200).json({ msg: 'Logout realizado com sucesso!' })

})

router.post('/reset-password', async (req, res) => {

    const { email } = req.body

    if (!email){
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }

    const user = await User.findOne({ email: email })

    if(!user){
        return res.status(404).json({ msg: 'Email não encontrado!' })
    }

    const token = crypto.randomBytes(20).toString('hex')

    user.resetToken = token
    user.resetTime = Date.now() + 3600000

    await user.save()

    const mailOptions = {
        from: process.env.GMAIL_ACC,
        to: user.email,
        subject: 'Link para redefinir sua senha',
        text: `Você está recebendo este email porque solicitou a redefinição de senha para sua conta.\n\n
        Por favor, clique no link a seguir, ou cole-o em seu navegador para concluir o processo dentro de uma hora após o recebimento:\n\n
        http://localhost:3000/reset-password/${token}\n\n
        Se você não solicitou isso, por favor, ignore este email e sua senha permanecerá inalterada.\n`,
    }

    try {

        const transporter = await createTransporter()
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Erro ao enviar email:', err);
                return res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })
            }
            res.status(200).json({ msg: 'Email de redefinição de senha enviado com sucesso!' })
        })

    } catch (err) {

        console.error('Erro ao criar o transportador:', err);
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })

    }

})

router.post('/reset-password/:token', async (req, res) => {

    const { token } = req.params
    const { password, confirmPassword } = req.body

    if(!password){
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }

    if(password != confirmPassword){
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    const user = await User.findOne({
        resetToken: token,
        resetTime: { $gt: Date.now() },
    })

    if (!user) {
        return res.status(400).json({ msg: 'Token inválido ou expirado!' })
    }

    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(password, salt)
    user.resetToken = undefined
    user.resetTime = undefined

    await user.save()

    res.status(200).json({ msg: 'Senha redefinida com sucesso!' })

})

module.exports = router