const logger = require('logger');

class PetValidator {

    static async createOrUpdateComplete(context, next){
        context.checkBody('name').notEmpty().len(2, 40);
        context.checkBody('birthdate').notEmpty().isDate();
        context.checkBody('vaccinate').notEmpty().isIn([true, false]);
        context.checkBody('city').notEmpty().in(['SG', 'M']);
        context.checkBody('image').optional().isUrl();

        if(context.errors) {
            context.body = context.errors;
            context.status = 400;
            return;
        }
        await next();
    }

    static async updatePartial(context, next){
        context.checkBody('name').optional().len(2, 40);
        context.checkBody('birthdate').optional().isDate();
        context.checkBody('vaccinate').optional().isIn([true, false]);
        context.checkBody('city').optional().in(['SG', 'M']);
        context.checkBody('image').optional().isUrl();

        if(context.errors) {
            context.body = context.errors;
            context.status = 400;
            return;
        }
        await next();
    }
}

module.exports = PetValidator;