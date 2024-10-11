const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

//run express instance
const app = express();

//config
require('dotenv/config');
const api = process.env.API_URL;
const authJwt = require('./helpers/jwt');

//middleware
app.use(bodyParser.json());//json parser
app.use(morgan('tiny'));//logge
app.use(authJwt);
console.log('before auth');


console.log('after auth');

//Routers
const productsRouter = require('./routers/products');
app.use(`${api}/products`, productsRouter);

const orderRouter = require('./routers/orders');
app.use(`${api}/orders`, orderRouter);



const userRouter = require('./routers/users');
app.use(`${api}/users`, userRouter);

const categoryRouter = require('./routers/categories');
app.use(`${api}/categories`, categoryRouter);


mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database is ready');
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=> {
    console.log(api);
    console.log("server is running on localhost:3000");
})