require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));




// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo postsDB');
});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model('User', userSchema);






app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    saveUserToDB(email, password);
    res.render("secrets");
});

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    findUserInDB(email, password)
    .then(isValidUser => {
        if (isValidUser) {
            res.render("secrets");
        } else {
            res.render("home");
        }
    })
});


async function findUserInDB(email, password) {
    try {
        const foundUser = await User.findOne({ email: email });
        console.log(foundUser.password);
        if (foundUser && foundUser.password === password) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function saveUserToDB(email, password) {
    try{
        const newUser = new User ({
            email: email,
            password: password
        });
        await newUser.save();
        console.log("user saved to db");
    }catch (err) {
        console.error("Error saving user:", err);
        throw err;
    }
}





app.listen(3000, ()=> {
    console.log("server running port 3000");
});