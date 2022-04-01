const mongoose = require("mongoose");
const DB = 'mongodb+srv://aftab:khanaftab@cluster0.5dkny.mongodb.net/vchat?retryWrites=true&w=majority';
mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology:true  
}).then(()=>{
    console.log("Successfully Connected");
}).catch((err)=>{
    console.log(err);
});