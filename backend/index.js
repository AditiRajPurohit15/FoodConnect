require("dotenv").config();
const express = require('express');
const connectDB = require('./src/config/DataBase/db');
const foodRoutes = require("./src/Routes/food.routes");
const userRoutes = require("./src/Routes/user.routes");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173',credentials: true }));
// Routes
app.use("/api/foods", foodRoutes);
app.use("/user", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

let PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`server is working on port ${PORT}`);
})