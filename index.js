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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

router.get("/getUser", (req, res) => {
  const { username, password } = req.query;
  db.collection("users").findOne({
    username: username
  }).then(function (user) {
    if (!user) {
      return res.json({ success: false });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          res.json({ success: true, user });
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
        const derivedUser = { ...user, id: user._id };
        delete derivedUser._id;
        delete derivedUser.__v;
        delete derivedUser.password;
        accum[user._id] = derivedUser;
        return accum;
      }, {})
    });
  });
});

router.post("/addUser", (req, res) => {
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
          password: hash
        });
        user.save(err => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true, user });
        });
      });
    }
  });
});

app.use("/api", router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));