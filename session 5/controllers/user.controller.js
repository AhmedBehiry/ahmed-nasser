const User = require ('../models/user.model')
const httpStatusText = require ('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapperr');
const appError = require('../utils/appError');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const userRoles = require('../utils/userRoles');

const getAllUsers  = asyncWrapper (async (req,res)=>{
    
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1 )* limit;
    const users  = await User.find({},{"__v": false, "password": false }).limit(limit).skip(skip)

    res.json({status : httpStatusText.SUCCESS , data : {users}})
})


const register = asyncWrapper( async (req , res , next) => {
    const {firstName,lastName,email,password,role} = req.body;

    oldUser = await User.findOne({email: email})
    if(oldUser){
        const error = appError.create("user email already exsits" ,400 , httpStatusText.FAIL )
        return next(error)

    }
    const hashedPassword = await bcrypt.hash(password , 7)
    const newUser = new User({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        role,
        avatar: req.file.filename,
        
    })

    const token = await generateJWT({email:newUser.email , id: newUser._id , role : newUser.role})
    newUser.token = token

    await newUser.save();
    res.status(201).json({status : httpStatusText.SUCCESS  , data : {user : newUser }});     
})

const login = asyncWrapper(async(req,res ,next) => {
    const {email,password} = req.body;

    if(!email && !password){
        const error = appError.create("email and password are required",400, httpStatusText.FAIL )
        return next(error)
    }
    const user = await User.findOne({email : email})
    
    if(!user) {
        const error = appError.create("user not found",400, httpStatusText.FAIL )
        return next(error)    
    }

    const matchedpassword = await bcrypt.compare(password , user.password)

    if(user && matchedpassword){
        const token = await generateJWT({email:user.email , id: user._id , role : user.role})

        return res.json({ status : httpStatusText.SUCCESS , data : {user: user.firstName , token} })}       
        else{
            const error = appError.create("password or email invalid plz try again", 500 , httpStatusText.ERROR)
            return next(error)
    }
})








    


module.exports = {
    getAllUsers,
    login,
    register
}