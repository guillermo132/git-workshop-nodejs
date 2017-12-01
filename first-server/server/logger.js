const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'Koa-api',
    level:process.env.NODE_ENV === 'prod' ? 'warn' : 'debug', //fatal, error, warn, info, debug, trace
    streams: [{
        path: './error.log',
        level: 'error'
    },{
        path: './log.log',
        level: 'debug',
         
    },{
        stream: process.stdout // para que el logger te salga por consola
    }] 
})

module.exports = logger; //importamos la instacia de nuestro logger