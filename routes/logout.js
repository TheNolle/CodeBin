import express from 'express'
const router = express.Router()

router.get('/logout', async (request, response) => {
    response.clearCookie('token')
    response.redirect('/login')
})

export default router