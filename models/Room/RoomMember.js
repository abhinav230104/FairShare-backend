const mongoose= require("mongoose");
const roomMemberSchema= new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        role:{
            type: String,
            enum: ["admin","member"],
            default: "member",
        },
    },
    { _id:false }
);

module.exports= roomMemberSchema;