async function myCall(url){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{  //simular funcion asincrona
                resolve(url);
        }, 1000);
    });
}

const p1 = myCall('value1');
const p2 = myCall('Value2');

const pAll = Promise.all([p1, p2]);
pAll.then(data =>{
     console.log(data.join(','));
});
/***************************** */
async function mult(value){
    return value*2;
}
//Cuando añadimos async devuelve una promesa siempre
//Esto nos permite usar la funcion await que hace que espera
async function myProgram(){
    try{
      const value1 = await myCall('value1');  
    }catch(){

    }
    console.log('finished');
}