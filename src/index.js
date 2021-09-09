require('dotenv').config();
const express = require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const cookieParser = require("cookie-parser");
const User = require('./modals/userSchema');
const Profile = require('./modals/profileSchema');
const Friend = require('./modals/friendSchema');
const bcrypt = require("bcryptjs");
const multer = require("multer");
//const upload = require({dest : 'uploads/'});
const auth = require('./middleware/auth');
const staticPath=path.join(__dirname,"../public");
const partialsPath=path.join(__dirname,"../templates/partials");
hbs.registerPartials(partialsPath);
app.set("view engine", "hbs");
const viewsPath=path.join(__dirname,"../templates/views");
app.set("views",viewsPath);
//db connection
require("./db/conn");
app.use(express.json());
app.use(cookieParser());
const { resolveSoa } = require("dns");
const { profile } = require('console');
app.use(express.urlencoded({extended:false}));
hbs.registerHelper("equal", require("handlebars-helper-equal"));
//console.log(process.env.SECRET_KEY); 
app.get("/", (req,res)=>{
    res.render("index");
});
app.get("/register", (req,res)=>{
    res.render("register");
});

app.get("/home", auth, async(req,res)=>{
    const suggestedPeople = await User.find({$and : [{username : {$ne : req.user.username}}, {'friendlist.friendname' : {$ne : req.user.username}}]});
    const fetchdata = await User.findOne({username:req.user.username});
    /*const friend = await Friend.find({$and: [
        {$or :[
            {requestSender: req.user.username} , {requestReciever: req.user.username}
        ]},
        {status:status}
    ]}); */
    const friend = req.query.friend;
    console.log(friend);
    if(friend){
    const fetch = await User.findOne({username: friend});
    res.render("home", {suggestedData : suggestedPeople, username:req.user.username,  findfriend: fetchdata.friendlist, chatfriend : fetch.username, chatfriendimage:fetch.userimage}); 
    }
    else {
    if(suggestedPeople){
        res.render("home", {suggestedData : suggestedPeople, username:req.user.username,  findfriend: fetchdata.friendlist});   
    }else{
        res.render("home", {suggestedData : suggestedPeople,  findfriend: fetchdata.friendlist});
    }
}
});
 
app.get("/profile", auth, async (req,res)=>{
    try{
        const fetchdata = await User.findOne({username:req.user.username});
        if(fetchdata){
           res.render("profile", {
               username: fetchdata.username,
               college: fetchdata.college,
               nickname:fetchdata.nickname,
               userimage: fetchdata.userimage,
               occupation: fetchdata.occupation,
               address: fetchdata.address,
               description:fetchdata.description,
               findfriend: fetchdata.friendlist
          }); 
        }else{
           res.render("profile", {username:req.user.username,findfriend: fetchdata.friendlist});
        }
       
       }
      
    catch(err){
    console.log(err);
   }
}
);
app.get("/userProfile", auth, async (req,res)=>{
    try{
    var user=req.query.id;
        const fetchdata = await User.findOne({username:user});
        if(fetchdata){
           res.render("userProfile", {
               username: fetchdata.username,
               college: fetchdata.college,
               nickname:fetchdata.nickname,
               userimage: fetchdata.userimage,
               occupation: fetchdata.occupation,
               address: fetchdata.address,
               description:fetchdata.description
          }); 
        }else{
           res.render("userProfile", {username:req.user.username});
        }  
     }
    catch(err){
    console.log(err);
   }
}
);
//to get profile

app.get("/friend-request", auth, async(req,res)=>{
    const status=0;
    const finddata = await User.findOne({username:req.user.username});
    if(finddata){
        res.render("friend-request", {friendrequest : finddata.friendlist});
    }else{
        res.render("friend-request", {msg : "No requset Found"});
    }
   
});

app.get("/logout", auth, async(req,res)=>{
    // logout from curren device
    req.user.tokens=req.user.tokens.filter((currElement)=>{
    return currElement.token != req.token
    })
    //logout from all devices
    req.user.tokens=[];
    res.clearCookie("jwt");
    await req.user.save();
    res.render("index"); 
});
app.post("/register", async(req,res)=>{
    try{
         const password = req.body.password;
         const cpassword = req.body.cpassword;
         const name = req.body.name;
         const email = req.body.email;
        let errors = [];
        User.findOne({username:name}).then(user=>{
            if(user){
                errors.push({msg: 'Username already taken'});
                res.render('register',{msg: 'Username already taken'});
            }
         })
        User.findOne({useremail:email}).then(user=>{
        if(user){
            errors.push({msg: 'Email already exists'});
            res.render('register',{msg: 'Email already exists'});
        }
        })
         if(password===cpassword){
         const user = new User({
         username : req.body.name,
         useremail : req.body.email,
         userpassword : req.body.password,
         userimage:"",
         nickname:"",
         college:"",
         occupation:"",
         address:"",
         description:""
        });
        const authToken = await user.generateToken();
        res.cookie('jwt', authToken, { 
            expires:new Date(Date.now() + 30000000),
            httpOnly : true,
            secure:true
        });
        const savedata = await user.save();
        res.render("register", {msg : `${name} , You registered successfully`}); 
    }
    else{
        res.render("register", {msg : "Password are not matching"});
    }
    }catch(err){
       console.log(err);
    }

})
app.post("/", async(req, res)=>{
    try{
      const user = req.body.user;
      const password = req.body.password;
      const ismatchuser = await User.findOne({username:user});
      const ismatchemail = await User.findOne({useremail:user});
      //console.log(ismatchuser);
      //console.log(ismatchemail);
     
      if(ismatchuser){
        const authToken = await ismatchuser.generateToken();
        res.cookie('jwt', authToken, { 
            expires:new Date(Date.now() + 30000000),
            httpOnly : true,
            secure:true
        });
        const isMatchpassword = await bcrypt.compare(password,ismatchuser.userpassword); 
           if(isMatchpassword){
           // const suggestedPeople = await User.find({username : {$ne : ismatchuser.username}});
           // res.render("home", {suggestedData : suggestedPeople});
           const suggestedPeople = await User.find({$and : [{username : {$ne : user}}, {'friendlist.friendname' : {$ne : user}}]});
           const fetchdata = await User.findOne({username:user});
           res.render("home", {suggestedData : suggestedPeople, username:user, findfriend: fetchdata.friendlist});  
           }else{
            res.render("index", {msg : "Invalid password"});
           }
      }else if(ismatchemail){
        const authToken = await ismatchemail.generateToken();
        res.cookie('jwt', authToken, { 
            expires:new Date(Date.now() + 30000000),
            httpOnly : true,
            secure:true
        });
        const isMatchpassword = await bcrypt.compare(password,ismatchemail.userpassword);
        if(isMatchpassword){
           //const suggestedPeople = await User.find({username : {$ne : ismatchemail.userenail}});
           const suggestedPeople = await User.find({$and : [{username : {$ne : ismatchemail.username}}, {'friendlist.friendname' : {$ne : ismatchemail.username}}]});
           const fetchdata = await User.findOne({username:ismatchemail.username});
           res.render("home", {suggestedData : suggestedPeople, username:ismatchemail.username, findfriend: fetchdata.friendlist});    
          }else{
           res.render("index", {msg : "Invalid password"});
          }
      }
      else{
        res.render("index", {msg : "Invalid username"});
      }
    }catch(err){
     console.log(err);
    }
})
var Storage = multer.diskStorage({
    destination : "../public/upload/",
    filename : (req,file,cb)=>{
        cb(null, file.fieldname + "_"+ Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage : Storage
}).single('profile-image');


app.post('/profile', [upload, auth], async(req,res, next)=>{
    try{
      User.findOne({username:req.user.username}, async(err, result)=>{
      if(err){
       console.log(err);
      }
      if(result){
          if(req.file){
            const updatedata = await User.updateOne({username:req.user.username}, 
                {$set : { 
                userimage:req.file.filename,
                nickname:req.body.nickname,
                college:req.body.college,
                occupation:req.body.occupation,
                address:req.body.address,
                description:req.body.desc}});
            const fetchdata = await User.findOne({username:req.user.username});
            if(fetchdata){
            res.render("profile", {
            username: fetchdata.username,
            college: fetchdata.college,
            nickname:fetchdata.nickname,
            userimage: fetchdata.userimage,
            occupation: fetchdata.occupation,
            address: fetchdata.address,
            description:fetchdata.description
            }); 
            }else{
             res.render("profile", {username:req.user.username});
            }
          }else{
            const updatedata = await User.updateOne({username:req.user.username}, 
                {$set : { 
                nickname:req.body.nickname,
                college:req.body.college,
                occupation:req.body.occupation,
                address:req.body.address,
                description:req.body.desc}});
                const fetchdata = await User.findOne({username:req.user.username});
                if(fetchdata){
                   res.render("profile", {
                       username: fetchdata.username,
                       college: fetchdata.college,
                       nickname:fetchdata.nickname,
                       userimage: fetchdata.userimage,
                       occupation: fetchdata.occupation,
                       address: fetchdata.address,
                       description:fetchdata.description
                  }); 
                }else{
                   res.render("profile", {username:req.user.username});
                }
          }
      }else{
        if(req.file){
        const profileData = new Profile({
            username:req.user.username,
            userimage:req.file.filename,
            nickname:req.body.nickname,
            college:req.body.college,
            occupation:req.body.occupation,
            address:req.body.address,
            description:req.body.desc
        });
        const savedata = await profileData.save();
        
        const fetchdata = await User.findOne({username:req.user.username});
     if(fetchdata){
        res.render("profile", {
            username: fetchdata.username,
            college: fetchdata.college,
            nickname:fetchdata.nickname,
            userimage: fetchdata.userimage,
            occupation: fetchdata.occupation,
            address: fetchdata.address,
            description:fetchdata.description
       }); 
     }else{
        res.render("profile", {username:req.user.username});
     }
    }else{
        const profileData = new User({
            userimage:"",
            username:req.user.username,
            nickname:req.body.nickname,
            college:req.body.college,
            occupation:req.body.occupation,
            address:req.body.address,
            description:req.body.desc
        });
        const savedata = await profileData.save();
        const fetchdata = await User.findOne({username:req.user.username});
     if(fetchdata){
        res.render("profile", {
            username: fetchdata.username,
            college: fetchdata.college,
            nickname:fetchdata.nickname,
            userimage: fetchdata.userimage,
            occupation: fetchdata.occupation,
            address: fetchdata.address,
            description:fetchdata.description
       }); 
     }else{
        res.render("profile", {username:req.user.username});
     }
    }
  }
  })}
  catch(err){
    console.log(err);
    }

})

app.post('/addFriend',auth, async(req,res)=>{
    try{
        const reciever = req.body.id;
        const sender = req.user.username;
        const status = 0;
        const readdata = await User.findOne({username:sender});
        const senderimage = readdata.userimage;
        /*
        const data = new Friend({
            requestSender:sender,
            requestReciever:reciever,
            senderImage:senderImage,
            status:status
        });
        const save = await data.save();  */
        const friendsdata = {friendname:sender, friendimage: senderimage, status : status,};
        const savedata = await User.findOneAndUpdate({username:reciever}, {$push:{
            friendlist:friendsdata
        }});
        if(savedata){
            res.send("1");
        }else{
            res.send("0");
        }
    }catch(err){
      console.log(err);
    }
});

app.post('/acceptFriend',auth, async(req,res)=>{
    try{
        const sender = req.body.id;
        const sendername = req.body.dataname;
        const senderimage = req.body.dataimage;
        const status = 1;
        /*const updatedata = await Friend.updateOne({_id:sender}, {$set: {
         status : status
        }});
        */
       const update = {friendname: sendername, friendimage: senderimage, status : status};
       const updatedata = await User.updateOne({$and : [{username:req.user.username}, {'friendlist._id': sender}]}, {'$set': {
            'friendlist.$' : update
           }});
        console.log(updatedata);
        if(updatedata){
            const find = await User.findOne({username:req.user.username});
            const findimage = find.userimage;
            const friendsdata = {friendname:req.user.username, friendimage : findimage, status : status};
            const savedata = await User.findOneAndUpdate({username:sendername}, {$push:{
                friendlist:friendsdata
            }});
            res.send("1");
        }else{
            res.send("0");
        }
    }catch(err){
      console.log(err);
    }
});

app.post('/rejectFriend',auth, async(req,res)=>{
    try{
        const sender = req.body.id;
        const sendername = req.body.dataname;
        const status = 2;
        /*const updatedata = await Friend.updateOne({_id:sender}, {$set: {
         status : status
        }});
        */
       const update = {friendname: sendername, status : status};
       const updatedata = await User.updateOne({$and : [{username:req.user.username}, {'friendlist._id': sender}]}, {'$set': {
            'friendlist.$' : update
           }});
        console.log(updatedata);
        if(updatedata){
            res.send("1");
        }else{
            res.send("0");
        }
    }catch(err){
      console.log(err);
    }
});




app.use(express.static(staticPath));
app.listen(3000,()=>{
    console.log("Success at port 3000");
})