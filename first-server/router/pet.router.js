const logger = require('logger');
const Router = require('koa-router');
const petService = require('../services/pet.service');
const PetValidator = require('../validators/pet.validators');

const router = new Router({
    prefix: '/pet'
});

class PetRouter{
    
    static async getAll(context){
        logger.info('Get all pets');
        context.body = await petService.getAll(context.query.page && 
            +context.query.page > 0 ? context.query.page: undefined, context.query.name, context.query.sort);
    }

    static async getById(context){
       // context.body= `hi ${context.params.id}`; //para recoger parametros parametros de la url
                                                 // context.jquery para recoger los parametros pasados despues de la ?
        logger.info(`Get pet by Id ${context.params.id}`);
        context.body = await petService.getById(context.params.id);//convertir a numero +
    }
    
    static async create(context){
        logger.info('Create user with body ', context.request.body);
        context.body = await petService.create(context.request.body);
    }
    static async updateComplete(context){
        logger.info(`Update complete with id ${context.params.id} with body:`,  context.request.body );
        context.body = await petService.updateComplete(context.params.id, context.request.body);
    }
    static async updatePartial(context){
        logger.info(`Update partial with id ${context.params.id} with body:`,  context.request.body );
        context.body = await petService.updatePartial(context.params.id, context.request.body)
    }
    static async delete(context){
        logger.info(`Delete pet with id ${context.params.id}`);
        context.body = await petService.delete(context.params.id);
    }
}

const checkExist = async (context, next) => {
    logger.debug('Checking if exist pet with id ', context.params.id);
    const pet = await petService.getById(context.params.id);
    if(!pet) {
        context.throw(404, 'Pet not found');
        return;
    }
    await next();
}

router.get('/',PetRouter.getAll);//primer parametro que va a servir y segundo argumento funcion que gestionara el evento
router.get('/:id',checkExist, PetRouter.getById); 
router.post('/',PetValidator.createOrUpdateComplete, PetRouter.create);
router.put('/:id',PetValidator.createOrUpdateComplete, checkExist, PetRouter.updateComplete);
router.patch('/:id', PetValidator.updatePartial, checkExist, PetRouter.updatePartial);
router.delete('/:id',checkExist, PetRouter.delete);         
//En postman y para enviar al server ficheros se usa form-data, que es la unica que soporta datos en binario
// Raw  lo que me envies lo leo segun lo que me marques para recibir normalmetne json
// 

module.exports = router; //exportamos el router para usarlo en otros  js
