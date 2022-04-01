const jwt = require("jsonwebtoken");
const User = require("../modals/userSchema");
const auth = async(req, res, next)=>{
    try{
      const token = req.cookies.jwt;
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({_id:verify._id});
      req.token=token;
      req.user=user;
      next();
    }catch(err){
       res.render("index", {msg : ""});
    }
}
module.exports = auth;