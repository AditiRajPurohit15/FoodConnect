const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        //get token from request header
        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized, token not found"});
        }
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized, invalid token"});
    }
}

module.exports = auth;