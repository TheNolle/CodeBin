import { checkAuthentication } from '../middlewares/authentication.js'

import Document from '../models/document.js'

import express from 'express'
const router = express.Router()

router.post('/save', checkAuthentication, async (request, response) => {
    const { value, password } = request.body
    try {
        const document = await Document.create({ value, password, user: request.user._id })
        response.redirect(`/${document._id}`)
    } catch (error) {
        response.render('new', { value })
    }
})

export default router