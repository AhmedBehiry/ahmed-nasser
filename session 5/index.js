require('dotenv').config()
const  express = require("express");
const  mongoose = require('mongoose');
const path = require('path')
const httpStatusText = require ('./utils/httpStatusText')
const cors = require('cors')
const url = process.env.MONGO_URL;  





mongoose.connect(url).then(() => {
    console.log("mongo db connected tmammm")
})

const app = express();
app.use(cors())
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

const coursesRouter = require('./routes/courses.route');
const userRouter = require('./routes/user.route');

app.use('/api/courses' , coursesRouter )
app.use('/api/users' , userRouter )



// global middleware for routes
app.all('*' ,(req , res, next) =>{  

    return res.status(404).json({status :httpStatusText.ERROR , message : "this link 8lt ya t3ban"});
})
//global error handler

app.use((error ,req ,res , next)  => {
    
    res.status(error.statusCode || 500).json({status : error.statusText || httpStatusText.ERROR , messagee :error.message  ,code : error.statusCode || 500 ,data : null})

})

app.listen(process.env.PORT, () => {
    
    console.log("listening to port 4000 y abo 7med")
})