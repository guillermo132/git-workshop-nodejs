const http = require('http');

const pets = [{
    name: 'java',
    birthdate: new Date(),
    age: 4,
    image: '',
    vaccinate: true,
    city: 'Segovia'
},{
    name: 'unix',
    birthdate: new Date(),
    age: 72,
    image: '',
    vaccinate: true,
    city: 'Segovia'
}]

const app = new http.Server((req,res) => {
    if(req.method === 'GET' && req.url === '/pet'){
        res.writeHead(200, {
            'content-Type': 'application/json' 
        })
        res.write(JSON.stringify(pets));
        res.end();
    }
});

app.listen(80);