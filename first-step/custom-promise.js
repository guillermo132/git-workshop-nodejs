class Promise{
    constructor(){
        this.cbs=[];
    }

    then(cb){
        const p = new Promise();
        const customCB= function(data){
            let result = cb(data);
            if(result instanceof CustomPromise){
                result.then((data)=>{
                    p.resolve(data);
                })
            }
        }
        this.cbs.push(customCB);
        return p;
    }

    resolve(data){
        this.cbs.map(cb => cb(data));
    }
}