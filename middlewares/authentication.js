import jsonwebtoken from 'jsonwebtoken'
import config from '../config.json' assert { type: 'json' }

export function checkAuthentication(request, response, next) {
    const token = request.cookies.token
    if (!token) return response.redirect('/login')
    try {
        const decoded = jsonwebtoken.verify(token, config.app.secret)
        request.user = decoded
        next()
    } catch (err) {
        response.render('login', { errorCode: 2 })
    }
}