const User = require('./user');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

exports.getUserById = (req, res) => {
  const { id } = req.query;
  User.findById(id).then(function(user) {
    if (!user) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, user: getDerivedUser(user) });
    }
  });
}

exports.getUsersByIds = (req, res) => {
  const idArray = req.query.ids.split(',');
  db.collection("users").find(
    { _id: { $in: idArray.map(id => ObjectID(id)) } }
  ).toArray().then(function(users) {
    return res.json({
      success: true,
      users: users.reduce((accum, user) => {
        accum[user._id] = getDerivedUser(user);
        return accum;
      }, {})
    })
  })
}

exports.getUser = (req, res) => {
  const { username, password } = req.query;
  db.collection("users").findOne({ username }).then(function (user) {
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
}

exports.getAllUsers = (req, res) => {
  db.collection("users").find({}, {}).toArray().then(function (users) {
    return res.json({
      success: true,
      users: users.reduce((accum, user) => {
        accum[user._id] = getDerivedUser(user);
        return accum;
      }, {})
    });
  });
}

exports.createUser = (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  db.collection("users").findOne({ username }).then(function (user) {
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
}

exports.updateProfileImage = (req, res) => {
  const { id, imageData } = req.body;
  User.findByIdAndUpdate(id, { profileImage: imageData }, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
}

exports.updateSavedRecipeIds = (req, res) => {
  const { id, savedRecipeIds } = req.body;
  User.findByIdAndUpdate(id, { savedRecipeIds }, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
}

exports.updateFriendIds = (req, res) => {
  const { id, friendIds } = req.body;
  console.log("friendIds:", friendIds);
  User.findByIdAndUpdate(id, { friendIds }, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  })
}