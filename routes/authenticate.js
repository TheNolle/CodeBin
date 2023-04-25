import jsonwebtoken from 'jsonwebtoken'
import config from '../config.json' assert { type: 'json' }

import User from '../models/user.js'

import express from 'express'
const router = express.Router()

router.post('/authenticate', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    if (!user) return response.render('login', { errorCode: 1 })
    if (user.password !== password) return response.render('login', { errorCode: 1 })
    const token = jsonwebtoken.sign({ _id: user._id }, config.app.secret)
    response.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
    response.redirect('/')
})

export default router