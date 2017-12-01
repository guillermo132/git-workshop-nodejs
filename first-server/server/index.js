const http = require('http');
const Koa = require('koa');
const KoaLogger = require('koa-logger');
const logger = require('logger');
const petRouter = require('../router/pet.router');
const htmlRouter = require('../router/html.router');
const authRouter = require('../router/auth.router');
const koaBody = require('koa-body');
const koaValidate = require('koa-validate');
const mount = require('koa-mount');
const views = require('koa-views');
const session = require('koa-session-store');
const StoreFile = require('koa-generic-session-file');
const StoreMongo = require('koa-session-mongo');
const convert = require('koa-convert');
const mongoose = require('mongoose');
const passport = require('koa-passport');


function onDBReady(err){
    if(err){
        logger.error('Error connecting ', error);
        process.exit(1);
    }
    logger.info('Connected to Mongodb successfully');
    const app = new Koa();
    if(process.env.NODE_ENV !== 'prod'){
        app.use(KoaLogger());
    }
    app.use(koaBody()); //parseo de los datos IMPORANTE realizarlo antes que recoger o inscribir datos
    
    app.keys = ['mySecret'];
    app.use(session({   //el session lo guarda en memoria
        key: 'jsessionid',
        prefix:'windows_',
        store: StoreMongo.create({
            url: 'mongodb://192.168.99.100:27017/pets_db' //mongo local 192.168.99.100
        })
        /*new StoreFile({  //esto lo guarda en la maquina, es mejor usar bbdd 
            sessionDirectory: `${__dirname}/sessions`
        })*/
    })); 


    app.use(passport.initialize());
    app.use(passport.session());

    require('../services/passport.services');

    
    app.use(async (context, next) => {
        logger.debug('Session: \n', context.session);
        await next();
        context.session.count = (context.session.count || 0) + 1;
    })
    
    koaValidate(app); //definicion para usar el validate de joa pet.validators
    
    app.use(views(`./views`,{ //__dirname directorio en el que estamos
        extension: 'ejs',
        map: {
            ejs: 'ejs'
        }
    }))
    
    app.use(async (ctx, next)=>{
        const initTime = Date.now();
        await next(); //para llamar al siguiente
        const time = Date.now() - initTime;
        ctx.set('x-response-time', `${time}ms`);
    })
    /*
    app.use(async (ctx)=>{
        console.log(ctx.headers);
        //console.log(ctx.query); //recoger parametros de la url
        ctx.body = pets.filter(pet => pet.name.startsWith(ctx.query.name));
    
    });
    */
    app.use(mount('/api/v1',petRouter.routes()))//definimos la gestion del router
            //mount añadimos al prefijo del router /api/v1/ para no tener que cambiarlo en todos los servicios
    app.use(htmlRouter.routes())//definimos la gestion del router
    app.use(authRouter.routes())

    app.listen(process.env.PORT, (err)=>{
        if(err){
            logger.error('Error listening', err);
            return;
        }
        logger.info(`API listening in port ${process.env.PORT}`);
    });
}


mongoose.connect('mongodb://192.168.99.100:27017/pets_db', onDBReady );//ip del profesor
