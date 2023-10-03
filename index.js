//! Imports
import express from 'express'
import mongoose from 'mongoose'
import config from './config.json' assert { type: 'json' }
import serverSetup from './functions/server.setup.js'


//? MongoDB
const encodedPassword = encodeURIComponent(config.database.password)
const connectionString = config.database.user ? `mongodb://${config.database.user}:${encodedPassword}@${config.database.host}:${config.database.port}/${config.database.name}` : `mongodb://{config.database.host}:${config.database.port}/${config.database.name}`

//? Express
const app = express()
const port = config.server.port || 2500

//* Server
app.listen(port, async () => {
    console.clear()

    await serverSetup(app)

    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Database is connected at ${config.database.host}:${config.database.port} (type: ${config.database.type})`))
        .catch(() => console.error('Database connection failed'))

    console.log(`Server is running at http://localhost:${config.server.port}`)
})