const express = require('express');
const router = express.Router();

//import schema
const {Orders} = require('../models/order');
const { OrderItem } = require('../models/order-item');

router.get(`/`, async(req,res)=>{
    const orderList = await Orders.find().populate('user', ['name','email']).sort({'dateOrdered': -1});

    if(!orderList){
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList);
})

router.get(`/:id`, async(req,res)=>{
    const orderList = await Orders.findById(req.params.id)
    .populate('user', ['name','email'])
    .populate({ 
        path : 'orderItems', populate : {
            path : 'product', populate : 'category', select : ['name', 'category'] }
        });//recursive populate,each outside populate is outermost of json body
    //{
    //  orderitems : [
    //                  product: producttablebyid
    //                  quantity: number
    //               ],
    //  user : usertablebyid
    //
    //}

    if(!orderList){
        return res.status(500).json({
            success: false
        })
    }
    res.send(orderList);
})

router.post(`/`, async(req,res)=>{

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem =>{ //.map returns promises for each entry. since async, should wait until promises is resolved
        let newOrderItem = new OrderItem({
            quantity:orderitem.quantity,
            product: orderitem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    })
    )

    const orderItemsIdsResolved = await orderItemsIds;

    //console.log(orderItemsIdsResolved);

    let order = new Orders({
        orderItems : orderItemsIdsResolved,
        shippingAddress1 : req.body.shippingAddress1,
        shippingAddress2 : req.body.shippingAddress2,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        status : req.body.status,
        totalPrice : req.body.totalPrice,
        user : req.body.user,
        dateOrdered : req.body.dateOrdered
    })

    order = await order.save();

    if(!order){
        return res.status(404).send('the order cannot be created~');

        //res.send(order);
    }
    
    res.send(order);
})

module.exports = router;