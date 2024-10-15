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
            path : 'product', populate : {
                path : 'category', select : ['name']
            }, select : ['name', 'category', 'price'] }
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


router.get(`/get/totalsales`, async (req, res)=> {
    const totalSales = await Orders.aggregate([
        {$group : { _id: null, totalsales : { $sum : '$totalPrice'}}}
    ])

    res.send({totalsales: totalSales.pop().totalsales})
})


router.get(`/get/count`, async(req,res)=>{
    const orderCount = await Orders.countDocuments()

    if(!orderCount){
        res.status(500).json({
            sucess: false
        })
    }
    res.send({
        count: orderCount
    });
})

router.get(`/get/usersorder/:userid`, async(req,res)=>{
    const userorderList = await Orders.find({user : req.params.userid})
        .populate({ 
            path : 'orderItems', populate : {
                path : 'product', populate : {
                    path : 'category', select : ['name']
                }, select : ['name', 'category', 'price'] }
            })
        .populate({ 
            path : 'user', select : ['name', 'email']
            });

    if(!userorderList){
        res.status(500).json({
            success: false
        })
    }
    res.send(userorderList);
})


router.post(`/`, async(req,res)=>{

    const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderitem =>{ //.map returns promises for each entry. since async, should wait until promises is resolved
        let newOrderItem = new OrderItem({
            quantity:orderitem.quantity,
            product: orderitem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    })
    )

    //console.log(orderItemsIds);

    let totalPrices = await Promise.all(orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    totalPrices = totalPrices.reduce((a,b) => a +b, 0);

    console.log(totalPrices)

    let order = new Orders({
        orderItems : orderItemsIds,
        shippingAddress1 : req.body.shippingAddress1,
        shippingAddress2 : req.body.shippingAddress2,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        status : req.body.status,
        totalPrice : totalPrices,
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


router.put(`/:id`, async(req,res)=>{
    const order = await Orders.findByIdAndUpdate(req.params.id,
        {
        status: req.body.status
    },{
        new:true
    })

    if(!order){
        return res.status(400).send('the order cannot be updated!');
    }

    res.send(order);
})


router.delete(`/:id`, (req,res)=>{
    Orders.findByIdAndDelete(req.params.id).then(async order =>{
        if(order){
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })

            return res.status(200).json({
                sucess:true,
                message : 'the order has been deleted'
            })
        }else {
            return res.status(404).json({
                success:false,
                message: 'order not found'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success : false,
            error: err
        })
    })
})


module.exports = router;