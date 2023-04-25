import express from 'express'
const router = express.Router()

router.get('/login', async (request, response) => {
    if (request.cookies.token) return response.redirect('/')
    response.render('login', { noButton: true })
})

export default router