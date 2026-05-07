const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    try {
        const {atoken} = req.headers;

        if(!atoken) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized login again'
            });
        }

        const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET_KEY);

        if(token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized login again'
            });
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}

module.exports = authAdmin;