import config from '../config.json' assert { type: 'json' }

export default async function configuration(request, response, next) {
    response.locals.config = config.app
    next()
}