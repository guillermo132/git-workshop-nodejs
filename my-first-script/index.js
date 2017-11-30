const fs = require('fs-promise');
const Log = require('./log');

async function removeDir(path){
    Log.debug(`Removing dir ${path}`);
    const files = await fs.readdir(path);
    if(files.length > 0){
        for(let i = 0, length = files.length; i < length; i++){
            const file = await fs.lstat(`${path}/${files[i]}`)
            if(file.isDirectory()){
                await removeDir(`${path}/${files[i]}`);
            }else{
                Log.debug(`Removing file ${path}/${files[i]}`);
                await fs.unlink(`${path}/${files[i]}`);
            }
        }
    }
    await fs.rmdir(path);
}

async function run(text) {
    Log.info('Running application'); 
    Log.debug('Checking if it exits dir');
    const files = await fs.readdir('.');

    for(let i = 0, length = files.length; i < length; i++){
        const stat = await fs.lstat('./'+files[i])
        if(files[i] === 'data' && stat.isDirectory()){
            await removeDir('./'+files[i]);
            break;
        }
        Log.debug(files[i]);
    }

    Log.debug('Creatin dir');
    await fs.mkdir('data');
    Log.debug('Writting file');
    await fs.writeFile('data/data.txt', text);
    Log.debug('Writed file');
    Log.debug('Reading file');
    /*await fs.readFile('data.txt',(data) => {
        console.log(data); 
    }); esto devuelve un buffer*/
    const readValue = await fs.readFile('./data/data.txt');
    Log.debug(`Read: ${readValue}`);
}



run(process.argv.slice(2).join(' ')).then(()=>{});