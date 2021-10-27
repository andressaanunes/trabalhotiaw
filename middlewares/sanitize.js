class Sanitize {
    constructor() {
        this.words =['SELECT', 'DROP TABLE','DROP','ALTER','MODIFY' ]

        this.sanitize = (req, res, next) => {
            let body = req.body;
            body.forEach((value,index)=> {
                console.log("valor: "+value+"index: "+index);
                if(value =='ITERAÇÃO DO ATIRBUTO WORDS'){
                    
                }
            }) 
            next();
        }
    }
}