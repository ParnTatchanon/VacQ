const mongoSanitize=require('express-mongo-sanitize');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const helmet=require('helmet');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//Load env vars
dotenv.config({path:'./config/config.env'});
//Connect to database
connectDB();

//Route files
const app=express();
const hospitals = require ('./routes/hospitals');
const auth = require ('./routes/auth');
const appointments = require('./routes/appointments');

// app.get('/', (req,res) => {
//     //res.send('<h1>Hello from express</h1>');
//     //res.send({name:'Brad'});
//     //res.json({name:'Brad'});
//     //res.sendStatus(400);
//     //res.status(400).json({success:false});
//     res.status(200).json({success:true, data:{id:1}});
// });

const swaggerOptions={
    swaggerDefinition:{
    openapi: '3.0.0',
    info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'A simple Express VacQ API'
        },
        servers:[
            {
                url: 'http://localhost:3000/api/v1'
            }
        ],
    },
    apis:['./routes/*.js'],
    };

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));


//Cookie parser
app.use(cookieParser());

//Body paraer
app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
    });
    app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/v1/hospitals', hospitals)
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);

const PORT=process.env.PORT || 3000;
const server = app.listen(PORT, console.log('Server running in ',process.env.NODE_ENV, ' mode on port ', PORT));



//Handle unhandled promise rejections
process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exot process
    server.close(()=> process.exit(1));
});