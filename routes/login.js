import express from 'express'
const router = express.Router()

router.get('/login', async (request, response) => {
    response.render('login')
})

export default router