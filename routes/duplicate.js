import checkAuthentication from '../middlewares/authentication.js'

import Document from '../models/document.js'

import express from 'express'
const router = express.Router()

router.get('/:id/duplicate', checkAuthentication, async (request, response) => {
    const { id } = request.params
    try {
        const document = await Document.findById(id)
        response.render('new', { value: document.value, saveable: true })
    } catch (error) {
        response.redirect(`/${id}`)
    }
})

export default router