import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,    
    },
    created_by:{
        type:String,
        required:true,
    },
});

const chatRoom = mongoose.model("chatRoom", chatSchema);
export default chatRoom;