const mongoose=require("mongoose");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    useremail:{
        type:String,
        required:true,
        unique:true
    },
    userpassword:{
        type:String,
        required:true
    },
    requestNotificationStatus:{
       type:String
    },
    acceptNotificationStatus:{
        type:String
     },
    notifications:[
        {
          sender:String,
          senderimage:String,
          message:String,
          status:String,
        }
    ],
    userstatus:{
        type:String
    },
    time:{
        type:String
    },
    day:{
        type:String
    },
    date:{
       type:String
    },
    month:{
        type:String
    }, 
    year:{
        type:String
    },
    friendlist: [
        {
            friendname:String,
            friendimage:String,
            status:String,
            userstatus:String,
            newMsgStatus:String,
            newMsgCount:Number,
            chatStatus:String,
            inChatStatus:String,
            messages:[
             {
                sender:String,
                reciever:String,
                message:String,
                time:String,
                status:String
             }
            ]
        }
    ],
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
    },
    tokens : [{
        token : {
         type:String,
         required:true   
        }
    }]
});
userSchema.methods.generateToken = async function(){
    try{
     token = jwt.sign({_id : this._id.toString()}, process.env.SECRET_KEY);
     this.tokens = this.tokens.concat({token:token});
     await this.save();
     return token;
    }catch(err){
    console.log(err);
    }
}
userSchema.pre("save", async function(next){
    if(this.isModified("userpassword")){
  // const passwordHash = await bcrypt.hash(password,10);
  // console.log(this.password);
   this.userpassword = await bcrypt.hash(this.userpassword,10);
   //console.log(this.password);
   //this.confirmPassword=undefined; // confirm password field will not saved by this
  }
   next();
})
const User = new mongoose.model("User", userSchema);
module.exports = User;