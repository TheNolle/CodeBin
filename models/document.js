import { model, Schema, SchemaTypes } from 'mongoose'

export default model('Document', new Schema({
    value: { type: String, required: true },
    password: String,
    user: { type: SchemaTypes.ObjectId, ref: 'User' }
}))
