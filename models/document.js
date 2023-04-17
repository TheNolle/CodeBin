import { model, Schema } from 'mongoose'

export default model('Document', new Schema({
    value: { type: String, required: true }
}))