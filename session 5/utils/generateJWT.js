const jwt = require('jsonwebtoken');

module.exports =  async(payload)=>{
    const token = jwt.sign(
        payload ,
        process.env.JWT_SECRET_kEY ,
        { expiresIn: '10m' }
    );
    return token;



}


