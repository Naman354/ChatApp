import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,   
    },
  created_by: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
});

const chatRoom = mongoose.model("chatRoom", chatSchema);
export default chatRoom;