import { checkAuthentication } from '../middlewares/authentication.js'

import Document from '../models/document.js'

import express from 'express'
const router = express.Router()

router.get('/:id', checkAuthentication, async (request, response) => {
    const { id } = request.params
    try {
        const document = await Document.findById(id)
        const authCookie = request.cookies[`doc_auth_${id}`]
        if (document.password && (!authCookie || authCookie !== document.password)) {
            response.render('password', { id, error: false })
        } else {
            response.render('code-display', { code: document.value, editable: true, id: document._id })
        }
    } catch (error) {
        response.redirect('/')
    }
})

export default router