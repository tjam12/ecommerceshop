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
const errorhandling = require('./helpers/error-handler')

//middleware
app.use(bodyParser.json());//json parser
app.use(morgan('tiny'));//logge
app.use(authJwt());
app.use(errorhandling);

//Routers
const productsRouter = require('./routers/products');
app.use(`${api}/products`, productsRouter);

const orderRouter = require('./routers/orders');
app.use(`${api}/orders`, orderRouter);

const userRouter = require('./routers/users');
app.use(`${api}/users`, userRouter);

const categoryRouter = require('./routers/categories');
app.use(`${api}/categories`, categoryRouter);

//const path = require('path')
//const frontend = path.join(__dirname,'../frontend')
const frontend = process.env.frontend

app.get(`/home`, (req, res) => {
    //res.sendFile('home.html', {root : frontend})
    sendHTML(res,'home.html')
});

function sendHTML (res, html){
    res.sendFile(html, {root : frontend}) 
}

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