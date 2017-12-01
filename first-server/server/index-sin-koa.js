
/****************SIN KOA******** */

const app = new http.Server((req,res) => {
    
    const regex = /\/pet\/(\d+)/;
    if(req.method === 'GET' && req.url === '/pet'){
        res.writeHead(200, {
            'content-Type': 'application/json' 
        })
        res.write(JSON.stringify(pets));
    }else if(req.method === 'GET' && /\/pet\/(\d+)/.test(req.url)){
        regex.lastIndex = 0;
        const id = regex.exec(req.url)[1];
        const pet = pets.find(pet => pet.id === +id); //con el + convertimos a cadena

        if(pet){
            res.writeHead(200, {
                'content-Type': 'application/json' 
            });
            res.write(JSON.stringify(pet));
        } else {
            res.statusCode = 404;
        }
    }
    res.end();
});

app.listen(5500);

/*******************PRUEBA*********************/
const app = new http.Server((req,res) => {
    console.log(`New Request`);
    
    res.writeHead(200, {
        'content-Type': 'application/json' 
    })
    res.write(JSON.stringify( { a: 1 } ));
    res.end();
});