const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: {type: String, required: false, trim: true}, //quitar espacios para eliminar espacios por delante y por detras
    password: {type: String, trim: true},
    salt: {type: String, trim: true},
    providerId: {type: String, trim: true},
    provider: {type: String, required: true, trim: true, default: 'local'},
    name: {type: String, required: true, trim: true},
    role: {type: String, required: true, trim: true, default: 'USER'}
});

const UserModel = mongoose.model('User', user);

module.exports = UserModel;