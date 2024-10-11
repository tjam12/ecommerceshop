const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    name: String,
    id: Number,
    countInStock: Number
})

exports.Orders = mongoose.model('Orders', ordersSchema);