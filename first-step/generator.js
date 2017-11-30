function generateId(){
    for(let i = 0; ;i++){ //loop infinito
        console.log(i);
    }
}

//una funcion lazy o generadora la hariamos asi:

function *  generateId(){
    for(let i = 0; ; i++){
        yield i;
    }
}
//evaluacion perezosa
const generator = generateId();
const next1 = generator.next();
console.log(next1); 

//esta funcion vale como generadora de id ya que siempre te devuelve el valor que no es usado