//* Packages Imports
import express from 'express'
import cookieParser from 'cookie-parser'

//* Middlewares Imports
import configuration from '../middlewares/configuration.js'

//* Routes Imports
import loginRoute from '../routes/login.js'
import authenticateRoute from '../routes/authenticate.js'
import homeRoute from '../routes/home.js'
import newRoute from '../routes/new.js'
import saveRoute from '../routes/save.js'
import codeRouter from '../routes/code.js'
import duplicateRoute from '../routes/duplicate.js'
import passwordRoute from '../routes/password.js'

export default async function serverSetup(app) {
    try {
        //* Middlewares
        app.set('view engine', 'ejs')
        app.use(cookieParser())
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(configuration)

        //* Routes
        app.use(loginRoute)
        app.use(authenticateRoute)
        app.use(homeRoute)
        app.use(newRoute)
        app.use(saveRoute)
        app.use(codeRouter)
        app.use(duplicateRoute)
        app.use(passwordRoute)

        console.log('Server is configured')
    } catch (error) {
        console.error('Server configuration failed')
    }
}