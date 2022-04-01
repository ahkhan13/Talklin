const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    username : {
        type : String
    },
    userimage : {
        type : String
    },
    nickname : {
        type : String
    },
    college : {
        type : String
    },
    occupation : {
        type : String
    },
    address : {
        type : String
    },
    description : {
        type : String
    }
    
});
const Profile = new mongoose.model("Profile", profileSchema);
module.exports = Profile;