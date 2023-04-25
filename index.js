//! Imports
import express from 'express'
import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

//* Config
import config from './config.json' assert { type: 'json' }

//* Models
import User from './models/user.js'
import Document from './models/document.js'




//? MongoDB
const encodedPassword = encodeURIComponent(config.database.password)
const connectionString = `mongodb://${config.database.user}:${encodedPassword}@${config.database.host}:${config.database.port}/${config.database.name}`

//* Connect to database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })




//? Json Web Token
function checkAuthentication(request, response, next) {
    const token = request.cookies.token
    if (!token) return response.render('login', { errorCode: 2 })
    try {
        const decoded = jsonwebtoken.verify(token, config.app.secret)
        request.user = decoded
        next()
    } catch (err) {
        response.render('login', { errorCode: 0 })
    }
}




//? Express
const app = express()
const port = config.server.port || 3000


//* Middlewares
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//- Configuration Loader
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
//= Login
app.get('/login', async (request, response) => {
    response.render('login')
})

//= Authenticate
app.post('/authenticate', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    if (!user) return response.render('login', { errorCode: 1 })
    if (user.password !== password) return response.render('login', { errorCode: 1 })
    const token = jsonwebtoken.sign({ _id: user._id }, config.app.secret)
    response.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
    response.redirect('/')
})

//= Home
app.get('/', async (request, response) => {
    const code = ['Welcome to CodeBin!', '', 'Use the commands in the top right corner', 'to create a new file to share with others.']
    response.render('code-display', { code: code.join('\n'), language: 'plaintext' })
})

//= New
app.get('/new', checkAuthentication, async (request, response) => {
    response.render('new', { saveable: true })
})

//= Save
app.post('/save', checkAuthentication, async (request, response) => {
    const { value, password } = request.body
    try {
        const document = await Document.create({ value, password, user: request.user._id })
        response.redirect(`/${document._id}`)
    } catch (error) {
        response.render('new', { value })
    }
})

//= Code
app.get('/:id', checkAuthentication, async (request, response) => {
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

//= Duplicate
app.get('/:id/duplicate', checkAuthentication, async (request, response) => {
    const { id } = request.params
    try {
        const document = await Document.findById(id)
        response.render('new', { value: document.value, saveable: true })
    } catch (error) {
        response.redirect(`/${id}`)
    }
})

//= Password
app.post('/:id/password', async (request, response) => {
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