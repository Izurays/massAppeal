class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.messssage = message;
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;