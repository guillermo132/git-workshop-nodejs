function myCall(url){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{  //simular funcion asincrona
            if(Date.now()%2 === 0){
                reject(new Error('Even value'));
            }else{
                resolve(url);
            }
        }, 1000);
    })
}

const myPromise = myCall('http://...');
const myPromise2 = myPromise.then((url)=>{
    return myCall('other URL');//llamada a subpromesa
})
myPromise2.then((url)=>{
    console.log('new url ', url)
})
/*
myPromise.then((url)=>{
    console.log('Resolved2 with: ', url)
})
myPromise.catch((err)=>{
    console.log('Error: ', err)
})*/

