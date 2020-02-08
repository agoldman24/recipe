const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require('cors');
const path = require('path');
const getSecret = require("./secret");
const User = require('./user');

const app = express();
const router = express.Router();

mongoose.connect(getSecret("dbUri"), { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

router.get("/user", (req, res) => {
  const { username, password } = req.query;
  User.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({
      success: true,
      users: data.filter(d => d.username === username && d.password === password)
    });
  });
});

router.get("/username", (req, res) => {
  const { username } = req.query;
  User.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({
      success: true,
      users: data.filter(d => d.username === username)
    });
  });
});

router.post("/addUser", (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const user = new User({ firstName, lastName, username, password });
  user.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);

// For any request that doesn't match one above, send back index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));