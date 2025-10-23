import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
    content:{
        type:String,
    },
},
{timestamps:true});

const Messages = mongoose.model("Messages", messageSchema);
export default Messages;