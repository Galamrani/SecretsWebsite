const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


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
    res.render('secrets');
});

app.post("/login", (req, res) => {

});


async function findUserInDB(email, password){

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