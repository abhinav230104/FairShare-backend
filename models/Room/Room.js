const mongoose= require("mongoose");
const roomMemberSchema= require("./RoomMember")
const roomSchema= new mongoose.Schema(
    {
        roomId:{
            type: String,
            required: true,
            unique: true,
        },
        name:{
            type: String,
            required:true,
            trim: true,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [roomMemberSchema],
    },
    { timestamps: true }
);

module.exports= mongoose.model("Room",roomSchema);