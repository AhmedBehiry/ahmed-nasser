const express = require('express')
const router = express.Router()
const multer = require('multer')
const userController = require ('../controllers/user.controller')
const verfiyToken = require ('../middleware/verfiytoken')
const appError = require('../utils/appError')

const diskStorage = multer.diskStorage({
    destination: function( req , file , cb){
        console.log("FILE", file);
        cb(null,'uploads')
    },
    filename : function(req, file ,cb) {

        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null,fileName)
    }
})
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0];
    if(imageType == 'image'){
        return cb(null , true)
    }else{
        return cb(appError.create("file must be image" ,400) , false) 
    }
}
const upload = multer({
    storage : diskStorage,
    fileFilter,
    


})
router.route('/')
    .get(userController.getAllUsers)
    
router.route("/register")
    .post(upload.single('avatar'),userController.register)

router.route("/login")
    .post(userController.login)

module.exports = router;





