const validator = require('validator');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const doctorModel = require('../models/doctorModel');
const jwt = require('jsonwebtoken');

// API for adding doctor

const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'please enter a valid email format'
            });
        }

        // validating strong password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // hasing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({
            success: true,
            message: 'Doctor added successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// api for update doctor

const updateDoctor = async (req, res) => {
    try {
        const { docId, name, email, speciality, degree, experience, about, fees, address, available } = req.body
        const imageFile = req.file

        if (!docId) {
            return res.json({ success: false, message: 'Doctor ID required' })
        }

        const updateData = {
            name, email, speciality, degree,
            experience, about,
            fees: Number(fees),
            address: typeof address === 'string' ? JSON.parse(address) : address,
            available
        }

        // Update image only if new one is uploaded
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            updateData.image = imageUpload.secure_url
        }

        await doctorModel.findByIdAndUpdate(docId, updateData)

        res.json({ success: true, message: 'Doctor Updated Successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// api for Delete Doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: 'Doctor ID required' })
        }

        await doctorModel.findByIdAndDelete(docId)

        res.json({ success: true, message: 'Doctor Deleted Successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { addDoctor, updateDoctor, deleteDoctor, /* ...your existing exports */ }

// API For Admin Login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY);
            return res.json({
                success: true,
                message: 'Admin logged in successfully',
                token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')

        res.json({
            success: true,
            doctors
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    addDoctor,
    loginAdmin,
    allDoctors,
    updateDoctor,
    deleteDoctor
}