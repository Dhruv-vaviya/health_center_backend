const validator = require('validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


// API to register user

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid email"
            })
        }

        // validating a strong password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Enter a strong password"
            })
        }

        // hasing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET_KEY)

        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

module.exports = {
    registerUser
}