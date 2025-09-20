const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g. "10 plates" or "5kg"
  location: { type: String, required: true }, // hostel, canteen, restaurant
  contact: { type: String, required: true }, // phone number
  expiryTime: { type: Date, required: true }, // till when food is good
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'picked', 'delivered'], default: 'available' },
},
{ timestamps: true});

let foodModel = mongoose.model("Food", foodSchema);
module.exports = foodModel;
