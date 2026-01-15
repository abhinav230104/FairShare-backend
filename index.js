const express= require("express");
const cors= require("cors");
require("dotenv").config();

const connectDB= require("./config/db")
const User= require("./models/User");
const app=express();

const authentication= require("./middlewares/authmiddleware")

const authRoutes = require("./routes/authroutes");
const roomRoutes = require("./routes/roomRoutes");

//Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();



// Test-Routes
app.get("/",(req,res)=> {
    res.send("FairShare is running!!!");
});

app.use("/api/auth", authRoutes);

app.get("/protected",authentication,(req,res)=>{
  res.json({
    userId: req.user.userId,
    name: req.user.name,
    email: req.user.email,
  });
});

app.use("/api/rooms", roomRoutes);

//Start Server
const PORT=5000;
app.listen(PORT,()=>
{
    console.log(`Server running on PORT: ${PORT}`);
});