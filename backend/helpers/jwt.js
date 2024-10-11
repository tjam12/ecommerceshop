const { expressjwt: jwt } = require('express-jwt'); // Correct import for express-jwt v7+

function authJWT() {
    const Secret = process.env.secret;
    const Api = process.env.API_URL;

    return jwt({
        secret: Secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
      }).unless({
        path:[
            `${Api}/users/login`,
            `${Api}/users/register`,
            {
                url: /\/api\/v1\/products(.*)/, //regex expression
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/categories(.*)/, //regex expression
                methods: ['GET', 'OPTIONS']
            }
        ]
      });
}

async function isRevoked(req, jwt){

    const payload = jwt.payload;

    if(!payload.isAdmin) {
        return true
    }
    else{
        return false
    }
}

module.exports = authJWT;