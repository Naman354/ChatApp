import mongoose from "mongoose";

const chatSchema = new chatSchema({
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