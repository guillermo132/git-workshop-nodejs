const logger = require('../server/logger');
const Router = require('koa-router');
const crypto = require('crypto');
const passport = require('koa-passport');
const UserModel = require('../models/user.model');

const router = new Router({
    prefix: '/auth'
});

class AuthRouter{
    static async signUp(ctx){
        logger.info('Signup user with data ', ctx.request.body);
        const salt = crypto.randomBytes(20).toString('hex'); //creamos variable hexadecimal
        const hash = crypto.createHash('sha512')
                        .update(ctx.request.body.password+salt).digest('hex'); //creamos un hash y le decimos como encriptar

        const user = await new UserModel({
            email: ctx.request.body.email,
            salt,
            password: hash,
            name: ctx.request.body.name,
            role: ctx.request.body.role // Aquii introducimos los datos que podemos recibir para guardar en la BBDD
        }).save()

        ctx.body = user;
    }

    static async showLogin(ctx){
        await ctx.render('login');
    }

    static async success(ctx){
        ctx.redirect('/pet');
    }

    static async fail(ctx){
        ctx.body = 'User not valid';
    }

    static async logout(ctx){
        ctx.logout();
        ctx.redirect('/auth/login');
    }
}

router.post('/sign-up', AuthRouter.signUp);
router.get('/login', AuthRouter.showLogin);
router.post('/login', passport.authenticate('local',{
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}));
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}))
router.get('/success', AuthRouter.success);
router.get('/fail', AuthRouter.fail);

module.exports = router;