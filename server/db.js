const mongoose = require('mongoose');
const MongoURI = 'mongodb://localhost:27017/interdb';
mongoose.connect(MongoURI).then(()=>console.log("Database connect to successfully")).catch((err)=>err.message)