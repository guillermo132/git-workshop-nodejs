const logger = require('../server/logger')
const passport = require('koa-passport');
const UserModel = require('../models/user.model');
const crypto = require('crypto');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local');
const TwitterStrategy = require('passport-twitter');

passport.serializeUser((user, done) =>{
    done(null, user._id)
})

passport.deserializeUser(async (id, done) =>{
    const user = await UserModel.findById(id); //con BBDD
    //const user = users.filter(user => user.id === id);
    done(null, user)
})
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true
}, async (email, password, done) =>{

    const user = await UserModel.findOne({ email });
    if(!user){
        done(null, false);
        return;
    }
    const hashPass = crypto.createHash('sha512').update(password+user.salt).digest('hex');
    if(hashPass !== user.password){
        done(null, false);
        return;
    }

    done(null, user);

}))

passport.use(new TwitterStrategy({
    consumerKey: 'RjFsXBziafOwKl20QEa057jNx', //lo mas correcto es poner process.env.TWITTER_CONSUMERKEY
    consumerSecret: 'YTC7HHLDzvtiDtztATz1EgB8TIJkANrB0QJkOls6gTPo4dkhEt',
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true', //para pedir el email
    callbackUrl: 'http://localhost:9000/auth/twitter/callback' //esta tiene que coincidir con la introducida en twitter
                //lo correcto seriia crear otra variable de entorno con el dominio.
}, async (token, tokenSecret, profile, done)=>{
    let user = await UserModel.findOne({provider: profile.provider, providerId: profile.id});

    if(!user){
        user = await new UserModel({
            provider: profile.provider,
            providerId: profile.providerId,
            name: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : ''
        }).save();
    } else {
        if(profile.emails && profile.emails.length > 0){
            user.email = profile.emails[0].value;
            await user.save();
        }
    }
    done(null, user);
}));

passport.use(new BasicStrategy((username, password, done)=>{
    logger.debug(`Doing authentication with ${username} and ${password}`);
    const user = users.filter((user) => user.username === username && user.password === password);
    if(user.length === 0){
        done(null, false);
    }else{
        done(null, user[0]);
    }
/*if(username === 'admin' && password === 'admin'){
        done(null, {
            name: 'Admin',
            role: 'ADMIN'
        });
    }else{
        done(null, false);
    }*/
}))