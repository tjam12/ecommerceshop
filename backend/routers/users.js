const {Users} = require('../models/user'); //{Users} <-- have to match your export objectn name
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`, async(req,res)=>{

    console.log('here');
    const userList = await Users.find().select('-passwordHash');
    console.log('here');

    if(!userList){
        res.status(500).json({
            success: false
        })
    }
    console.log('here');
    res.send(userList);
    console.log('here');
})

router.get(`/:id`, async(req,res)=>{
    const user = await Users.findById(req.params.id).select('-passwordHash');;

    if(!user){
        return res.status(500).json({
            message: 'The user with the given ID was not found',
            success: false
        })
    }
    res.status(200).send(user);
})

router.post(`/`, async(req,res)=>{

    let user = new Users({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,  
    })

    user = await user.save();

    if(!user){
        return res.status(404).send('the user cannot be created~');

        res.send(user);
    }
    
    res.send(user);
})

router.post('/login', async (req,res) => {
    const user = await Users.findOne({
        email: req.body.email
    })
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send('The user not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )

        return res.status(200).send({user: user.email, token: token})
    }
    else{
        return res.status(400).send('Password is wrong')
    }

    //return res.status(200).send(user);
})

module.exports = router;