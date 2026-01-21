const express= require("express");
const cors= require("cors");
require("dotenv").config();

const connectDB= require("./config/db")
const User= require("./models/User");
const app=express();

const authentication= require("./middlewares/authmiddleware")

const authRoutes = require("./routes/authroutes");
const roomRoutes = require("./routes/roomroutes");
const expenseRoutes= require("./routes/expenseroutes");

//Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Connect to DB
connectDB();


// Test-Routes
app.get("/",(req,res)=> {
    res.send("FairShare is running!!!");
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/rooms/expense",expenseRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>
{
    console.log(`Server running on PORT: ${PORT}`);
});