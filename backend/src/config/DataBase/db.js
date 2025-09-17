const mongoose = require('mongoose');

let connectDB = async ()=>{
    try{
 let res = await mongoose.connect(process.env.MONGO_URI);
        if(res){
            console.log("mongoDB connected");
        }
    }catch(error){
        console.log("error in connecting db", error);
            
    }
}
module.exports = connectDB;