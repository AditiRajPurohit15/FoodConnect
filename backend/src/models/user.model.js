const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
        match : /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['donor', 'volunteer', 'ngo'],
        default: 'donor',
    },
},
    {timestamps: true},
)

let userModel = mongoose.model("User", userSchema);
module.exports = userModel;