const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    try {
        const {token} = req.headers;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized login again'
            });
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = token_decoded.id
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}

module.exports = authUser;