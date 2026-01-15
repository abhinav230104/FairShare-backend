const express= require("express");
const cors= require("cors");

const app=express();

//Middlewares
app.use(cors());
app.use(express.json());

// Test-Routes
app.get("/",(req,res)=> {
    res.send("FairShare is running!!!");
});

//Start Server
const PORT=5000;
app.listen(PORT,()=>
{
    console.log(`Server running on PORT: ${PORT}`);
});