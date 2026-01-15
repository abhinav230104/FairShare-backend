const express= require("express");
const cors= require("cors");
require("dotenv").config();

const connectDB= require("./config/db")
const User= require("./models/User");
const app=express();

//Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

//Id generator
const generateUserId= ()=>{
 const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
 let code="";
 for(let i=0;i<4;i++)
 {
    let ind=Math.floor(Math.random()*chars.length);
    code+=chars.charAt(ind);
 }
 return `nomad-${code}`;
};

// Test-Routes
app.get("/",(req,res)=> {
    res.send("FairShare is running!!!");
});

app.get("/test-user", async (req, res) => {
  try {
    const user = new User({
      userId: generateUserId(),
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
      password: "dummypass"
    });

    await user.save();
    const savedUser = await User.findById(user._id);
    res.json(savedUser);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Start Server
const PORT=5000;
app.listen(PORT,()=>
{
    console.log(`Server running on PORT: ${PORT}`);
});