require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const adminRouter = require('./routes/adminRoute');


// app config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});