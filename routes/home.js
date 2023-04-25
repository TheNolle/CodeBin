import express from 'express'
const router = express.Router()

router.get('/', async (request, response) => {
    const code = ['Welcome to CodeBin!', '', 'Use the commands in the top right corner', 'to create a new file to share with others.']
    response.render('code-display', { code: code.join('\n'), language: 'plaintext', new: true })
})

export default router