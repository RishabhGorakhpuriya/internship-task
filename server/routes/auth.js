
// auth.js file  contain user validation & end point
const express = require('express');
const router = express.Router();
const User = require('../module/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchUser')
const bodyParser = require("body-parser"); 
router.use(express.json());
router.use(bodyParser.json());
const JWT_SECRET = 'RishabhBadBoy'


// Route 1 : Create a user  : POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 4 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be atleast 6 character").isLength({ min: 6 })
], async (req, res) => {
    let success = true
    // if there are error, retrun bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    
    try {
        let user = await User.findOne({success, email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry with this email user already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        secPassword = await bcrypt.hash(req.body.password, salt)
        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET); 
        res.json({success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error har occure")
    }
})

// Route 2 :  Authentication user and login : POST "/api/auth/loginuser"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists()
], async (req, res) => {
    let success = false
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Sorry user does not exists" })
        }
        const comparepassword = await  bcrypt.compare(password, user.password);
        if (!comparepassword) {
            success = false
            return res.status(400).json({success, error: "Please try to login correct credential" })
        }
        const data = {
            user: {
                id: user.id
            } 
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(400).send("Some error occured")

    }
})

// Route 2 :  get  logedin user details : POST "/api/auth/getuser" Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Some error occured")
    }
})


router.get('/getdata', (req, res)=>{
    User.findOne(req.body.id).then(result=>{
        res.status(200).json({
            use:result
        }).catch=(err)=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        }
    })
})



module.exports = router