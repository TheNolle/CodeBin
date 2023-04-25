import checkAuthentication from '../middlewares/authentication.js'

import express from 'express'
const router = express.Router()

router.get('/new', checkAuthentication, async (request, response) => {
    response.render('new', { saveable: true })
})

export default router