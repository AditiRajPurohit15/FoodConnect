const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth.middleware');

router.get('/home', auth, async (req, res) => {
    try {
        let user = await userModel.findById(req.user.id);
        return res.status(200).json({
            message: "Welcome to home page",
            user: user
        });
    } catch (error) {
        console.log("error in home->", error);
        return res.status(500).json({ message: "internal server error" });
    }
});


router.post('/register', async(req, res)=>{
    try {
        let {name, email, mobile, password, role} = req.body;

        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        let hashedPass = await bcrypt.hash(password, 10);
        let newUser= await userModel.create({
            name,
            email,
            mobile,
            password: hashedPass,
            role
        })

        let token = jwt.sign({id: newUser._id, role: newUser.role},process.env.SECRET_KEY, {expiresIn: '1h'})
        res.cookie('token',token);

        return res.status(201).json({message: "User registered successfully", })
        
    } catch (error) {
        return res.status(500).json({message: "internal server error"});
    }
})

router.post('/login', async(req, res)=>{
    try {
        let {email, password} = req.body;
        let checkUser = await userModel.find({email});
        console.log(checkUser);
        let comparePass = await bcrypt.compare(password, checkUser[0].password);
        if(!comparePass){
            return res.status(401).json({message: "invalid credentials"});
        }
        let token = jwt.sign({id: checkUser[0]._id, role: checkUser[0].role}, process.env.SECRET_KEY, {expiresIn : '1h'});
        res.cookie('token',token);
        return res.status(200).json({message: "login successful"});
        
    } catch (error) {
        return res.status(500).json({message: "internal server error"});
    }
})

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token');  // clear the cookie
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout->", error);
        return res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;