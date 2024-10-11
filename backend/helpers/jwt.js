const { expressjwt: jwt } = require('express-jwt'); // Correct import for express-jwt v7+
const express = require('express');

function authJWT() {
    const Secret = process.env.secret;
    console.log('here');
    console.log(Secret);


    let token = jwt({
        secret: Secret,
        algorithms: ["HS256"], // Or the algorithms you use for your JWT
    })

    console.log('here2');
    console.log(token);

    return token;
}

module.exports = authJWT;