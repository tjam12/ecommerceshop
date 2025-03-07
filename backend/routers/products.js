const express = require('express');
const router = express.Router();
//import model/schema
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');

router.get(`/`, async(req,res)=>{
//localhost:3000/api/v1/products?categories=2342342,234234
    console.log('after auth');
    let filter = {};

    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');
    //.select('name image -_id');

    if(!productList){
        res.status(500).json({
            sucess: false
        })
    }
    res.send(productList);
})

router.get(`/:id`, async(req,res)=>{
    const productList = await Product.findById(req.params.id).populate('category');

    if(!productList){
        res.status(500).json({
            sucess: false
        })
    }
    res.send(productList);
})

router.put(`/:id`, async(req,res)=>{

    // if(mongoose.isBertwashereValidObjectId(req.params.id)){
    //     res.status(400).send('Invalid product id');
    // }
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category')
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock : req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
    },{
        new:true
    })

    if(!product){
        return res.status(400).send('the product cannot be created!');
    }

    res.send(product);
})

router.post(`/`, async (req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category')
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock : req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if(!product){
        return res.status(500).send('The product cannot be created');
    }

    res.send(product);
})

router.delete(`/:id`, (req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({
                sucess:true,
                message : 'the product has been deleted'
            })
        }else {
            return res.status(404).json({
                success:false,
                message: 'product not found'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success : false,
            error: err
        })
    })
})

router.get(`/get/count`, async(req,res)=>{
    const productCount = await Product.countDocuments({})

    if(!productCount){
        res.status(500).json({
            sucess: false
        })
    }
    res.send({
        count: productCount
    });
})


router.get(`/get/featured/:count`, async(req,res)=>{
    const count = req.params.count ? req.params.count : 0;
    const featuredProduct = await Product.find({isFeatured: true}).limit(+count);

    if(!featuredProduct){
        res.status(500).json({
            sucess: false
        })
    }
    res.send({
        count: featuredProduct
    });
})


module.exports = router