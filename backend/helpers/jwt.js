const { expressjwt: jwt } = require('express-jwt'); // Correct import for express-jwt v7+


function authJWT() {
    return jwt({
        secret: process.env.secret,
        algorithms: ["HS256"],
      });
}

module.exports = authJWT;