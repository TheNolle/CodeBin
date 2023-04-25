import config from '../config.json' assert { type: 'json' }

export async function configuration(request, response, next) {
    response.locals.config = config.app
    response.locals.authtoken = request.cookies.token
    next()
}