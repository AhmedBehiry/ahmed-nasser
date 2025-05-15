const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText')

module.exports = (...roles) =>{

    return (req,res,next) =>{
        if(!roles.includes(req.currentUser.role)){
            return next(appError.create("this page only for authorized people" ,401 , httpStatusText.ERROR))
        }
        next();
    }



}