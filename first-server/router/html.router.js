const logger = require('logger');
const Router = require('koa-router');
const petServices = require('../services/pet.service');
const passport = require('koa-passport');

const router = new Router();
class HTMLRouter{
    static async home(context){
        logger.info('Generating home page');
        await context.render('home');  //primer argumento cargar el views que queremos, 
        //el segundo pasar los datos que queremos qeu tenga la view
    }
    static async pets(context){
        logger.info('Generating pet page');
        const pets = await petServices.getAll();
        await context.render('pets',{
            pets
        })
    }
}

async function isAuthenticated(ctx, next) {
    if(ctx.isUnauthenticated()){
        ctx.redirect('/auth/login');
        return;
   }
    await next();    
}

async function isAdmin(ctx, next){
    if(ctx.state.user.role === 'ADMIN'){
        await next();
        return;
    }

    ctx.throw(403, 'Not authorized');
}
router.get('/', HTMLRouter.home);
router.get('/pet', isAuthenticated, isAdmin, HTMLRouter.pets); //Solo vamos a poder acceder si estamos logueados con basic
                    //sustituimos passport.authenticate('basic') por una funciona que nos devuelva si se logueado correctamente
module.exports = router;