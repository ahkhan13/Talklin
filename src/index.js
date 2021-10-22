require('dotenv').config();
const express = require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const cookieParser = require("cookie-parser");
const PORT = process.env.port || 3000;
const User = require('./modals/userSchema');
const Profile = require('./modals/profileSchema');
const Chatmsg = require('./modals/chatSchema');
const Notify = require('./modals/notifySchema');
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
const { SocketAddress } = require('net');
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
    const friend = req.query.friend;
    const fetchNotification = await User.findOne({username:req.user.username});
   // const UnreadMsgCount = await Chatmsg.find({$and : [{sender:data.from}, {reciever:data.to}, {status:0}]}).count();
    //console.log(friend);
    const updateChatStatus = await User.findOneAndUpdate({$and : [{username:req.user.username},{'friendlist.chatStatus':"active"}]}, {'$set': {
        'friendlist.$.chatStatus': "inactive",
    }});
    const updateinChatStatus = await User.findOneAndUpdate({$and : [{'friendlist.friendname': req.user.username},{'friendlist.inChatStatus':"active"}]}, {'$set': {
        'friendlist.$.inChatStatus': "inactive",
    }});
    if(friend){
    const fetch = await User.findOne({username: friend});
        if(fetch){
            const updateChatStatus = await User.findOneAndUpdate({$and : [{username:req.user.username},{'friendlist.friendname':friend}]}, {'$set': {
                'friendlist.$.chatStatus': "active",
            }});
            const updateinChatStatus = await User.findOneAndUpdate({$and : [{username: friend},{'friendlist.friendname':req.user.username}]}, {'$set': {
                'friendlist.$.inChatStatus': "active",
            }});
            const updateNewMsgStatus = await User.findOneAndUpdate({$and : [{username:req.user.username},{'friendlist.friendname':friend}]}, {'$set': {
                'friendlist.$.newMsgStatus': "noMsg",
                'friendlist.$.newMsgCount': ""
            }});
            const updateReadMsgStatus = await Chatmsg.updateMany({$and : [{sender:friend}, {reciever:req.user.username}]},{$set:{
                status:1
            }})
            const suggestedPeople = await User.find({$and : [{username : {$ne : req.user.username}}, {'friendlist.friendname' : {$ne : req.user.username}}]});
            const fetchdata = await User.findOne({username:req.user.username});
            var lastTime = fetch.time;
            var lastDay = fetch.day;
            var lastDate = fetch.date;
            var lastMonth = fetch.month;
            var lastYear = fetch.year;
            var userstatus = fetch.userstatus;
            var currTime = new Date();
            var currDay  = currTime.getDay();
            var currDate  = currTime.getDate();
            var currMonth = currTime.getMonth();
            var currYear = currTime.getFullYear();
            console.log(userstatus);
      
            if(Math.abs(currDay-lastDay)==0 && Math.abs(currDate-lastDate)==0 && Math.abs(currMonth-lastMonth)==0  && Math.abs(currYear-lastYear)==0){
                    lastDay="today";
                    lastMonth="";
                    lastYear="";
                    lastDate="";
            }else if(Math.abs(currDate-lastDate)==1 && Math.abs(currMonth-lastMonth)==0  && Math.abs(currYear-lastYear)==0){
                lastDay="yesterday";
                lastMonth="";
                lastYear="";
                lastDate="";
            }else if(Math.abs(currYear-lastYear)==0){
                lastYear="";
                if(lastMonth==0){
                    lastMonth="Jan"
                }else if(lastMonth==1){
                    lastMonth='Feb';
                }
                else if(lastMonth==2){
                    lastMonth='Mar';
                }else if(lastMonth==3){
                    lastMonth='Apr';
                }else if(lastMonth==4){
                    lastMonth='May';
                }else if(lastMonth==5){
                    lastMonth='Jun';
                }else if(lastMonth==6){
                    lastMonth='Jul';
                }else if(lastMonth==7){
                    lastMonth='Aug';
                }else if(lastMonth==8){
                    lastMonth='Sep';
                }else if(lastMonth==9){
                    lastMonth='Oct';
                }else if(lastMonth==10){
                    lastMonth='Nov';
                }else if(lastMonth==11){
                    lastMonth='Dec';
                }
                if(lastDay==0){
                    lastDay='Sun';
                }else if(lastDay==1){
                    lastDay='Mon';
                }
                else if(lastDay==2){
                    lastDay='Tue';
                }
                else if(lastDay==3){
                    lastDay='Wed';
                }
                else if(lastDay==4){
                    lastDay='Thu';
                }
                else if(lastDay==5){
                    lastDay='Fri';
                }else if(lastDay==6){
                    lastDay='Sat';
                }
            }else{
                lastYear=lastYear;
                if(lastMonth==0){
                    lastMonth="Jan"
                }else if(lastMonth==1){
                    lastMonth='Feb';
                }
                else if(lastMonth==2){
                    lastMonth='Mar';
                }else if(lastMonth==3){
                    lastMonth='Apr';
                }else if(lastMonth==4){
                    lastMonth='May';
                }else if(lastMonth==5){
                    lastMonth='Jun';
                }else if(lastMonth==6){
                    lastMonth='Jul';
                }else if(lastMonth==7){
                    lastMonth='Aug';
                }else if(lastMonth==8){
                    lastMonth='Sep';
                }else if(lastMonth==9){
                    lastMonth='Oct';
                }else if(lastMonth==10){
                    lastMonth='Nov';
                }else if(lastMonth==11){
                    lastMonth='Dec';
                }
                if(lastDay==0){
                    lastDay='Sun';
                }else if(lastDay==1){
                    lastDay='Mon';
                }
                else if(lastDay==2){
                    lastDay='Tue';
                }
                else if(lastDay==3){
                    lastDay='Wed';
                }
                else if(lastDay==4){
                    lastDay='Thu';
                }
                else if(lastDay==5){
                    lastDay='Fri';
                }else if(lastDay==6){
                    lastDay='Sat';
                }
            }

          

            const fetchmsg = await Chatmsg.find({$or:[
                                                {$and:[{sender:req.user.username}, {reciever:friend}]}, 
                                                {$and:[{sender:friend}, {reciever:req.user.username}]}]});
            res.render("home", {suggestedData : suggestedPeople, username:req.user.username,  findfriend: fetchdata.friendlist, chatfriend : fetch.username,userstatus:userstatus, chatimage:fetch.userimage, chatmsg : fetchmsg, lastDay:lastDay,lastDate:lastDate,lastMonth:lastMonth, lastTime:lastTime, lastYear:lastYear, requestNotificationStatus:fetchNotification.requestNotificationStatus, acceptNotificationStatus:fetchNotification.acceptNotificationStatus});
          }else{
            const suggestedPeople = await User.find({$and : [{username : {$ne : req.user.username}}, {'friendlist.friendname' : {$ne : req.user.username}}]});
            const fetchdata = await User.findOne({username:req.user.username});
            if(suggestedPeople){
                res.render("home", {suggestedData : suggestedPeople, username:req.user.username,  findfriend: fetchdata.friendlist, requestNotificationStatus:fetchNotification.requestNotificationStatus, acceptNotificationStatus:fetchNotification.acceptNotificationStatus});   
            }else{
                res.render("home", {suggestedData : suggestedPeople,  findfriend: fetchdata.friendlist, requestNotificationStatus:fetchNotification.requestNotificationStatus, acceptNotificationStatus:fetchNotification.acceptNotificationStatus});
            }
        }
    }
    else {
    const suggestedPeople = await User.find({$and : [{username : {$ne : req.user.username}}, {'friendlist.friendname' : {$ne : req.user.username}}]});
    const fetchdata = await User.findOne({username:req.user.username});
    if(suggestedPeople){
        res.render("home", {suggestedData : suggestedPeople, username:req.user.username,  findfriend: fetchdata.friendlist,requestNotificationStatus:fetchNotification.requestNotificationStatus, acceptNotificationStatus:fetchNotification.acceptNotificationStatus});   
    }else{
        res.render("home", {suggestedData : suggestedPeople,  findfriend: fetchdata.friendlist, requestNotificationStatus:fetchNotification.requestNotificationStatus, acceptNotificationStatus:fetchNotification.acceptNotificationStatus});
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
               findfriend: fetchdata.friendlist,
               requestNotificationStatus:fetchdata.requestNotificationStatus, 
               acceptNotificationStatus:fetchdata.acceptNotificationStatus
          }); 
        }else{
           res.render("profile", {username:req.user.username,findfriend: fetchdata.friendlist, requestNotificationStatus:fetchdata.requestNotificationStatus, acceptNotificationStatus:fetchdata.acceptNotificationStatus});
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
        const status=1;
        const checkfriend = await User.findOne({$and : [{username:user}, {'friendlist.friendname':req.user.username}, {'friendlist.status':status}]});
        if(checkfriend){
          //const fetchdata = await User.findOne({username:user});
               res.render("userProfile", {
                   username: checkfriend.username,
                   loggeduser:req.user.username,
                   college: checkfriend.college,
                   nickname:checkfriend.nickname,
                   userimage: checkfriend.userimage,
                   occupation: checkfriend.occupation,
                   address: checkfriend.address,
                   description:checkfriend.description,
                   fetchfriend:checkfriend.friendlist,
                   friend:"Friend"
              }); 
            
        }else{
            const fetchdata = await User.findOne({username:user});
            console.log(fetchdata.friendlist);
            res.render("userProfile", {
                username: fetchdata.username,
                loggeduser:req.user.username,
                college: fetchdata.college,
                nickname:fetchdata.nickname,
                userimage: fetchdata.userimage,
                occupation: fetchdata.occupation,
                address: fetchdata.address,
                description:fetchdata.description,
                fetchfriend:fetchdata.friendlist,
                friend:"Add-Friend"
           }); 
        }
    }
    catch(err){
    console.log(err);
   }

});
//to get profile

app.get("/friend-request", auth, async(req,res)=>{
    const status=0;
    notificationStatus="seen";
    const updateNotifiction = await User.findOneAndUpdate({username:req.user.username}, {$set:{
        requestNotificationStatus:notificationStatus
    }})
    const finddata = await User.findOne({username:req.user.username});
    res.render("friend-request", {friendrequest : finddata.friendlist, username:req.user.username, acceptNotificationStatus:finddata.acceptNotificationStatus});
});

app.get("/notification", auth, async(req,res)=>{
     const status = 0;
     notificationStatus="seen";
     const updateNotify = await User.findOneAndUpdate({username:req.user.username}, {$set:{
            acceptNotificationStatus:notificationStatus
     }});
     const findNotify = await User.findOne({username:req.user.username});
     res.render("notification", {notification:findNotify.notifications, username:req.user.username, requestNotificationStatus:findNotify.requestNotificationStatus});
})

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
         acceptNotificationStatus:"",
         requestNotificationStatus:"",
         userstatus:"",
         time:"",
         day:"",
         date:"",
         month:"",
         year:"",
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
          // const update = {friendname: sendername, friendimage: senderimage, status : status};
         
           const suggestedPeople = await User.find({$and : [{username : {$ne : user}}, {'friendlist.friendname' : {$ne : user}}]});
           const fetchdata = await User.findOne({username:user});
           res.render("home", {suggestedData : suggestedPeople, username:user, findfriend: fetchdata.friendlist,requestNotificationStatus:fetchdata.requestNotificationStatus, acceptNotificationStatus:fetchdata.acceptNotificationStatus});  
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
           res.render("home", {suggestedData : suggestedPeople, username:ismatchemail.username, findfriend: fetchdata.friendlist, requestNotificationStatus:fetchdata.requestNotificationStatus, acceptNotificationStatus:fetchdata.acceptNotificationStatus});    
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
            const status = 1;
            const updateimage = {friendimage:req.file.filename, friendname:req.user.username, status:status};
            const updateinfriend = await User.findOneAndUpdate({$and : [{'friendlist.status': status},{'friendlist.friendname':req.user.username}]}, {$set : {
                 'friendlist.$':updateimage 
            }});
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
            description:fetchdata.description,
            findfriend: fetchdata.friendlist,
            requestNotificationStatus:fetchdata.requestNotificationStatus, 
            acceptNotificationStatus:fetchdata.acceptNotificationStatus
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
                       description:fetchdata.description,
                       findfriend: fetchdata.friendlist,
                       requestNotificationStatus:fetchdata.requestNotificationStatus, 
                       acceptNotificationStatus:fetchdata.acceptNotificationStatus
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
        const recieverdata = await User.findOne({_id:reciever});
        const readdata = await User.findOne({username:sender});
        const senderimage = readdata.userimage;
        const checkrequest = await User.findOne({$and : [{username:recieverdata.username}, {'friendlist.friendname':sender}]});
        if(checkrequest){
            res.send("0"); 
        }else{
            const friendsdata = {friendname:sender, friendimage: senderimage, status : status, userstatus:"Online", newMsgStatus:"noMsg", newMsgCount:"", chatStatus:"inactive", inChatStatus:"inactive"};
            const savedata = await User.findOneAndUpdate({_id:reciever}, {$push:{
                friendlist:friendsdata
            }});
            if(savedata){
                const notificationStatus = "unseen";
                const updateNotification=await User.findOneAndUpdate({_id:reciever}, {$set:{
                    requestNotificationStatus: notificationStatus
                }});
                res.send("1");
            }else{
                res.send("0");
            }
        }
        
    }catch(err){
      console.log(err);
    }
});

app.post('/acceptFriend',auth, async(req,res)=>{
    try{
        const sender = req.body.id;
        const sendername = req.body.dataname;
        const status = 1;
        const checkAlreadyFriendExist = await User.findOne({$and : [{username:sendername}, {'friendlist.friendname': req.user.username}]});
        if(checkAlreadyFriendExist){
            const updatedata = await User.findOneAndUpdate({$and : [{username:req.user.username}, {'friendlist.friendname': sendername}]}, {'$set': {
                'friendlist.$.status' : status
               }});
            const updateFrienddata = await User.findOneAndUpdate({$and : [{username:sendername}, {'friendlist.friendname': req.user.username}]}, {'$set': {
                'friendlist.$.status' : status
               }});
            if(updateFrienddata){
                res.send("1");
            }else{
                res.send("0");
            }
        }else{ 
        const updatedata = await User.findOneAndUpdate({$and : [{username:req.user.username}, {'friendlist.friendname': sendername}]}, {'$set': {
                'friendlist.$.status' : status
              }});
        if(updatedata){
                const find = await User.findOne({username:req.user.username});
                const findimage = find.userimage;
                const friendsdata = {friendname:req.user.username, friendimage : findimage, status : status, userstatus:"Online", newMsgStatus:"noMsg", newMsgCount:"", chatStatus:"inactive", inChatStatus:"inactive"};
                const savedata = await User.findOneAndUpdate({username:sendername}, {$push:{
                    friendlist:friendsdata
                }});
                const notifyData = {sender:req.user.username, senderimage : findimage, status : 0, message:"has been accepted your request"};
                const notificationData = await User.findOneAndUpdate({username:sendername}, {$push:{
                    notifications:notifyData
                }});
                const notificationStatus = "unseen";
                const updateNotification = await User.findOneAndUpdate({username:sendername}, {$set:{
                    acceptNotificationStatus: notificationStatus
                }});
                res.send("1");
            }else{
                res.send("0");
            }
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
        //const update = {friendname: sendername, status : status};
        const updatedata = await User.findOneAndUpdate({'friendlist._id': sender}, {$pull : {
               friendlist : {_id : sender}
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
const server  = app.listen(PORT,()=>{ 
    console.log("Success at port 3000");
})

app.get("/logout", auth, async(req,res)=>{
    // logout from current device
   try{
   
   //  res.render("logout", {username : req.user.username}); 
     req.user.tokens=req.user.tokens.filter((currElement)=>{
        return currElement.token != req.token;
        })
        //logout from all devices
        req.user.tokens=[];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index");
  
}catch(err){
    console.log(err);
}
});

const io = require('socket.io')(server);
var users={};



io.on('connection', (socket)=>{
    
         socket.on("New-user-joined", async(username)=>{
         users[username]=socket.id;

         const updatestatus = await User.updateOne({username:username}, {$set:{
            userstatus:"Online"
         }})
         const updatedata = await User.updateMany({'friendlist.friendname': username}, {'$set' : {
         'friendlist.$.userstatus' : "Online"
        }});
         socket.broadcast.emit('user-connected', username);
    })
   
     /*disconnectUser= async function(){
        for (var prop in users) {
            if (users.hasOwnProperty(prop)) {
                if (users[prop] === socket.id){
                    var disconnected_user = prop;
                    console.log(socket.id);
                }
            }
        }
        console.log(disconnected_user);
        var dt = new Date();
        var hour = dt.getHours();
        var am_pm = hour > 12 ? "pm" : "am";
        var time = dt.getHours() + ":" + dt.getMinutes()+" "+am_pm;
        var currDay = dt.getDay();
        var currDate = dt.getDate();
        var currMonth = dt.getMonth();
        var currYear = dt.getFullYear();
        const update = {time:time, day:currDay, month:currMonth, year:currYear}
        const updatestatus = await User.updateOne({username:disconnected_user}, {$set:{
            userstatus: "Offline",
            time:time,
            day:currDay,
            date:currDate,
            month:currMonth,
            year:currYear
        }})

        const updatedata = await User.updateMany({'friendlist.friendname': disconnected_user}, {'$set': {
                'friendlist.$.userstatus' : "Offline"
        }});
       socket.broadcast.emit('user-disconnected', {user:disconnected_user, time:time, day:currDay, month:currMonth, year:currYear});
       delete users[disconnected_user];
       console.log(users);
       }

       */
   socket.on('disconnect', async()=>{
       setTimeout(async() => {
           
        try{
            for (var prop in users) {
                if (users.hasOwnProperty(prop)) {
                    if (users[prop] === socket.id){
                        var disconnected_user = prop;
                    }
                }
            }
            var dt = new Date();
            var hour = dt.getHours();
            var am_pm = hour > 12 ? "pm" : "am";
            var time = dt.getHours() + ":" + dt.getMinutes()+" "+am_pm;
            var currDay = dt.getDay();
            var currDate = dt.getDate();
            var currMonth = dt.getMonth();
            var currYear = dt.getFullYear();
            const update = {time:time, day:currDay, month:currMonth, year:currYear}
            const updatestatus = await User.updateOne({username:disconnected_user}, {$set:{
                userstatus: "Offline",
                time:time,
                day:currDay,
                date:currDate,
                month:currMonth,
                year:currYear
            }})
            const updatedata = await User.updateMany({'friendlist.friendname': disconnected_user}, {'$set': {
             'friendlist.$.userstatus' : "Offline"
            }});
            socket.broadcast.emit('user-disconnected', {user:disconnected_user, time:time, day:currDay, month:currMonth, year:currYear});
        
           delete users[disconnected_user];
        }catch(err){
            console.log(err);
        }

       }, 5000);
       
    })

     socket.on('message', async(data)=>{
        const socketid = users[data.to];
        const inChatStatus = await User.findOne({$and : [{username:data.from}, {'friendlist.friendname': data.to}, {'friendlist.inChatStatus': "active"}]});
        if(inChatStatus){
            const chatmsg = new Chatmsg({
                sender:data.from, 
                reciever:data.to,
                messages:data.msg,
                time:data.time,
                status:1
            });
            const savemsg = await chatmsg.save();
            io.to(socketid).emit("messages", {user:data.from, msg:data.msg, time:data.time});
        }else{
        const chatmsg = new Chatmsg({
            sender:data.from, 
            reciever:data.to,
            messages:data.msg,
            time:data.time,
            status:0
        });
        const newMsgStatus="newMsg";
        const savemsg = await chatmsg.save();
        const UnreadMsgCount = await Chatmsg.find({$and : [{sender:data.from}, {reciever:data.to}, {status:0}]}).count();
        const updateNewMsgStatus = await User.findOneAndUpdate({$and:[{username:data.to}, {'friendlist.friendname':data.from}]},{'$set':{
            'friendlist.$.newMsgStatus': newMsgStatus,
            'friendlist.$.newMsgCount':UnreadMsgCount
        }})
        
        if(chatmsg){
         io.to(socketid).emit("message", {user:data.from, msg:data.msg, time:data.time, UnreadMsgCount:UnreadMsgCount});
        }else{
            console.log("error");
        }
    }
     });
   
     socket.on('onfocus', (data)=>{
        const socketid = users[data.to];
        io.to(socketid).emit("onfocus", {user:data.from, msg:data.msg});
    });

     socket.on('onfocusout', (data)=>{
        const socketid = users[data.to];
        io.to(socketid).emit("onfocusout", {user:data.from, msg:data.msg});
    });
    
    socket.on('addFriend', async(data)=>{
        try{
            const reciever = data.reciever;
            const sender = data.sender;
            const socketid = users[reciever];
            io.to(socketid).emit("request-notification", {sender:data.sender, reciever:data.reciever});
        }catch(err){
          console.log(err);
        }      
    })
    socket.on('acceptFriend', async(data)=>{
        try{
            const reciever = data.reciever;
            const sender = data.sender;
            const socketid = users[sender];
            io.to(socketid).emit("accept-notification", {sender:data.sender, reciever:data.reciever});
        }catch(err){
          console.log(err);
        }      
    })

})









