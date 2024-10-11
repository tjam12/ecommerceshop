const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'OrderItem',
        required:true
    }],
    shippingAddress1: {
        type: String,
        required:true
    },
    shippingAddress2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',//follow mongoose schema naming, not exports
        required:true
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})


ordersSchema.virtual('id').get(function () {
    return this._id.toHexString();
}
)

ordersSchema.set('toJSON', {
    virtuals: true,
});


exports.Orders = mongoose.model('Orders', ordersSchema);