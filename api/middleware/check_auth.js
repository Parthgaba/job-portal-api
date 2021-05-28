const jwt = require("jsonwebtoken")

var secure = (req, res, next) => {
    try {
        const decode = jwt.verify(req.body.token, process.env.JWT_KEY)
        req.decodedData = decode
    }catch(e) {
        return res.status(401).json({
            error: 'Authentication Failed'
        })
    }
    next();
}

module.exports = secure