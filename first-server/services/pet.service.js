const logger = require('logger');
const PetModel = require('../models/pets.model');
const ObjectId = require('mongoose').Types.ObjectId;

function * GenId(){
    let i = 0;
    for(;;){
        yield i++
    }
}

class PetService {
    constructor(){
        this.pets = [];
        this.genId = GenId();
    }
    
    async getAll(page=1, name, sort='createdAt'){
        const filter = {};
        if(name){
            filter.name = new new RegExp(`^${name}`);
        }
        return await PetModel.find(filter).select(['-__v']).limit(2).skip((page-1) * 2).sort(sort); //ordena de mayor a menor 
                                //el select nos devuelve todas las columnas esxpecto la qeu le marquemos
                                //podemos  marcar cuantas queremos devolver con limit y
                                // marcar las paginas que queremos que muestre con skip
    }

    async getById(id){
        return await PetModel.findById(id);
    }
    
    async create(data){
        const pet = new PetModel(data);
        await pet.save();
        return pet;
    }
    async updateComplete(id, data){
        //COn mongoose
        let pet = await PetModel.findById(id);
        pet = Object.assign(pet, data)//esto copia atributos no metodos
        await pet.save();
        return pet;

        /*
        let updatedPet = null;
        this.pets = this.pets.map(pet => {
            if(pet.id === id){
                data.id = pet.id;
                updatedPet = data;
                return data;
            }
            return pet;
        });
        return updatedPet;*/
    }
    async updatePartial(id, data){
        let pet = await PetModel.findById(id);
        pet = Object.assign(pet, data)//esto copia atributos no metodos
        await pet.save();
        return pet;
        /*
        let updatedPet = null;
        this.pets = this.pets.map(pet => {
            if(pet.id === id){
                updatedPet= Object.assign({},pet, data); //mezcla el objeto, se sustituyen los datos del primero por los del segundo y 
                //si no tiene algun valor declarado se añade al array
                return updatedPet
            }
            return pet;
        });
        return updatedPet;*/
    }
    async delete(id){
        let pet = await PetModel.findById(id);
        await pet.remove();/*
        //diferentes maneras
        const ObjectId = require('mongoose').Types.ObjectId;
        let pet = await PetModel.finOneAndRemove({_id: ObjectId(id)});

        //borra todos los elementos que cumplan la condicion
        await PetModel.remove({_id: ObjectId(id)}) //nos devuelve el numero de elementos borrados

        /*
        const pet = this.getById(id);
        this.pets = this.pets.filter(pet => pet.id !== id);
        return this.pets*/
    }
}

module.exports = new PetService();

