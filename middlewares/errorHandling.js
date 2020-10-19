function errorHandling(err){

    let status,msg;

    switch(err.name){
        case 'SequelizeValidationError':
            status = 400;
            msg = err.errors[0].message;    
        break;
        // case 'Invalid password':
        //     status = 400;
        //     msg = err.name    
        // break;
        // case 'Email not found':
        //     status = 400;
        //     msg = err.name    
        // break;
        default:
            status = 500;
            msg = err.errors[0].message;
        break;
    }
    res.status(status).json(msg)    
}
module.exports = errorHandling;


