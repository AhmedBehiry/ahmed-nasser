const jwt = require("jsonwebtoken")
const httpStatusText = require("../utils/httpStatusText")
const appError= require("../utils/appError")

const verfiyToken = (req, res, next)=>{

    const authHeader =  req.headers['authorization'] || req.headers['Authorization']
    if(!authHeader) {
        const error = appError.create("Token is required " ,401 , httpStatusText.ERROR )
        return next(error)
    }
    const token = authHeader.split(' ')[1];
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY );
        req.currentUser = currentUser;
        next();
    }
    catch(err){
        const error = appError.create("invalid Token " ,401 , httpStatusText.ERROR )
        return next(error)
    }
}

module.exports = verfiyToken
