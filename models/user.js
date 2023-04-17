import { model, Schema } from 'mongoose'

export default model('User', new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
}))
