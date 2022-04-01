const mongoose = require("mongoose");
const friendSchema = new mongoose.Schema({
    requestSender:{
        type:String
    },
    requestReciever:{
        type:String
    },
    senderImage:{
         type:String
    },
    status:{
        type:String
    }
});
const Friend = new mongoose.model("Friend",friendSchema);
module.exports = Friend;
