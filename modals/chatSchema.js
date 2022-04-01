const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender:{
        type:String
    },
    reciever:{
        type:String
    },
    messages:{
          type:String
    },
    time:{
        type:String,
    },
    status:{
        type:String
    }
})

const Chatmsg = new mongoose.model("Chatmsg", chatSchema);
module.exports = Chatmsg;