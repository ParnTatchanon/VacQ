const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path:'./config/config.env'});
//Connect to database
connectDB();

//Route files
const app=express();
const hospitals = require ('./routes/hospitals');
const auth = require ('./routes/auth');
// app.get('/', (req,res) => {
//     //res.send('<h1>Hello from express</h1>');
//     //res.send({name:'Brad'});
//     //res.json({name:'Brad'});
//     //res.sendStatus(400);
//     //res.status(400).json({success:false});
//     res.status(200).json({success:true, data:{id:1}});
// });

//Body paraer
app.use(express.json());
app.use('/api/v1/hospitals', hospitals)
app.use('/api/v1/auth',auth);
//Cookie parser
app.use(cookieParser());

const PORT=process.env.PORT || 3000;
const server = app.listen(PORT, console.log('Server running in ',process.env.NODE_ENV, ' mode on port ', PORT));



//Handle unhandled promise rejections
process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exot process
    server.close(()=> process.exit(1));
});