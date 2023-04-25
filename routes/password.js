import Document from '../models/document.js'

import express from 'express'
const router = express.Router()

router.post('/:id/password', async (request, response) => {
    const { id } = request.params
    const { password } = request.body
    try {
        const document = await Document.findById(id)
        if (document.password && document.password === password) {
            response.cookie(`doc_auth_${id}`, password, { maxAge: 86400000 })
            response.redirect(`/${id}`)
        } else {
            response.render('password', { id, error: true })
        }
    } catch (error) {
        response.redirect('/')
    }
})

export default router