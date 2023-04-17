//! Imports
import express from 'express'
import mongoose from 'mongoose'
//* Config
import config from './config.json' assert { type: 'json' }
//* Models
import Document from './models/document.js'



//? MongoDB
const encodedPassword = encodeURIComponent(config.database.password)
const connectionString = `mongodb://${config.database.user}:${encodedPassword}@${config.database.host}:${config.database.port}/${config.database.name}`
//* Connect to database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })



//? Express
const app = express()
const port = config.server.port || 3000

//* Middlewares
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(async (request, response, next) => {
    response.locals.config = config
    next()
})

//* Server
app.listen(port, () => {
    console.clear()
    console.log(`Database is connected at ${config.database.host}:${config.database.port} (type: ${config.database.type})`)
    console.log(`Server is running at https://${config.server.domain}:${config.server.port}`)
})


//* Routes
//= Home
app.get('/', async (request, response) => {
    const code = ['Welcome to CodeBin!', '', 'Use the commands in the top right corner', 'to create a new file to share with others.']
    response.render('code-display', { code: code.join('\n'), language: 'plaintext' })
})

//= New
app.get('/new', async (request, response) => {
    response.render('new', { saveable: true })
})

//= Save
app.post('/save', async (request, response) => {
    const { value } = request.body
    try {
        const document = await Document.create({ value })
        response.redirect(`/${document._id}`)
    } catch (error) {
        response.render('new', { value })
    }
})

//= Code
app.get('/:id', async (request, response) => {
    const { id } = request.params
    try {
        const document = await Document.findById(id)
        response.render('code-display', { code: document.value, editable: true, id: document._id })
    } catch (error) {
        response.redirect('/')
    }
})

//= Duplicate
app.get('/:id/duplicate', async (request, response) => {
    const { id } = request.params
    try {
        const document = await Document.findById(id)
        response.render('new', { value: document.value, saveable: true })
    } catch (error) {
        response.redirect(`/${id}`)
    }
})