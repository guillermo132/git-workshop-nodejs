const mongoose = require('mongoose');


const Pet = new mongoose.Schema({
    name: {type: String, required: true, trim: true} ,
    birthdate: {type: Date, required: true} ,
    city: {type: String, required: true, trim: true},
    image: {type: String, trim: true} ,
    vaccinate:{type: Boolean, required: true} ,
    createdAt:{type: Date, required: true, default: Date.now}
})

const PetModel = mongoose.model('Pet', Pet);

module.exports = PetModel;