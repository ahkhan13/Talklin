const mongoose = require('mongoose');
const notifySchema = mongoose.Schema({
    sender:{
        type:String
    },
    reciever:{
        type:String
    },
    message:{
        type:String
    },
    status:{
        type:String
    }

})
const Notify = new mongoose.model("Notify", notifySchema);
module.exports = Notify;