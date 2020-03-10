const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require('cors');
const path = require('path');
const getSecret = require("./secret");
const User = require('./user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const router = express.Router();

mongoose.connect(getSecret("dbUri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

const getDerivedUser = user => {
  const {
    _id, username, firstName, lastName, profileImage,
    friendIds, draftRecipeIds, createdRecipeIds, savedRecipeIds
  } = user;
  return {
    id: _id, username, firstName, lastName, profileImage,
    friendIds, draftRecipeIds, createdRecipeIds, savedRecipeIds
  }
}

router.get("/getUserById", (req, res) => {
  const { id } = req.query;
  User.findById(id).then(function(user) {
    if (!user) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, user: getDerivedUser(user) });
    }
  });
});

router.get("/getUser", (req, res) => {
  const { username, password } = req.query;
  db.collection("users").findOne({ username }).then(function(user) {
    if (!user) {
      return res.json({ success: false });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          return res.json({ success: true, user: getDerivedUser(user) });
        } else {
          return res.json({ success: false });
        }
      });
    }
  });
});

router.get("/getAllUsers", (req, res) => {
  db.collection("users").find({}, {}).toArray().then(function (users) {
    return res.json({
      success: true,
      users: users.reduce((accum, user) => {
        accum[user._id] = getDerivedUser(user);
        return accum;
      }, {})
    });
  });
});

router.post("/createUser", (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  db.collection("users").findOne({
    username: username
  }).then(function (user) {
    if (user) {
      return res.json({ success: false });
    } else {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        const user = new User({
          firstName, lastName, username,
          password: hash,
          profileImage: null
        });
        user.save(err => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true, user: getDerivedUser(user) });
        });
      });
    }
  });
});

router.post('/updateUser', (req, res) => {
  const { id, imageData } = req.body;
  User.findByIdAndUpdate(id, { profileImage: imageData }, err => {
    if (err) return res.json({ success: false, error: err });
     return res.json({ success: true });
  });
});

app.use("/api", router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));