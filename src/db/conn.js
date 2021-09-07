const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vchat", {
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(()=>{
    console.log("Successfully Connected");
}).catch((err)=>{
    console.log(err);
});