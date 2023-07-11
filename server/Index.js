
// index.js file this is main file our project
const express = require('express');
var cors = require('cors')
var app = express()

const bodyParser = require("body-parser"); 
const connectToMongo = require('./db');
const PORT = 2300
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/data', require('./routes/auth'))
app.get('/', (req, res)=>{
    res.send("Hello today i have won twele hundred");
})
app.listen(PORT, ()=>{
    console.log(`server start port no ${PORT}`)
})