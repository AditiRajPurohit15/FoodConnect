 const express = require('express');
 const router = express.Router();
 //const jwt = require('jsonwebtoken');
 //const bcrypt = require('bcrypt');
 const auth = require('../middlewares/auth.middleware');
 const foodModel = require('../models/food.model');
 const roleCheck = require('../middlewares/role.middleware');

 // Add new food(Donor Only)
 router.post('/add',auth,roleCheck(["donor"]), async(req, res)=>{
    try {
        let { itemName, quantity, location, contact, expiryTime, donorId } = req.body;
        let newFood = await foodModel.create({
            itemName,
            quantity,
            location,
            contact,
            expiryTime,
            donorId: req.user._id   // comes from JWT
        })
        res.status(201).json({ message: "Food listed successfully", food: newFood });
    } catch (error) {
        res.status(500).json({ message: "Error adding food", error });
    }
 })

// Get all available food
router.get("/available", auth, roleCheck(["volunteer", "ngo", "donor"]), async (req, res) => {
    try {
        const foods = await foodModel.find({ status: "available" })
            .populate("donorId", "name email"); // show donor info
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching available food", error });
    }
});

// Get food details by ID
router.get("/:id", auth, async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id)
            .populate("donorId", "name email");
        if (!food) return res.status(404).json({ message: "Food not found" });
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food", error });
    }
});

// Update food status (picked/delivered) - Volunteer/NGO only
router.put("/:id", auth, roleCheck(["volunteer", "ngo"]), async (req, res) => {
    try {
        const { status } = req.body; // "picked" or "delivered"
        if (!["picked", "delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const food = await foodModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!food) return res.status(404).json({ message: "Food not found" });
        res.json({ message: "Food status updated", food });
    } catch (error) {
        res.status(500).json({ message: "Error updating food", error });
    }
});

// Delete food (only donor who created it)
router.delete("/:id", auth, roleCheck(["donor"]), async (req, res) => {
    try {
        const food = await foodModel.findOneAndDelete({ 
            _id: req.params.id, 
            donorId: req.user._id 
        });

        if (!food) return res.status(404).json({ message: "Food not found or not authorized" });
        res.json({ message: "Food listing deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting food", error });
    }
});


module.exports = router;