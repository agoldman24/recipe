const User = require('./user');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getUserFields = user => {
  const {
    _id, username, firstName, lastName, profileImageId,
    followerIds, followingIds, createdRecipeIds, likedRecipeIds
  } = user;
  return {
    id: _id, username, firstName, lastName, profileImageId,
    followerIds, followingIds, createdRecipeIds, likedRecipeIds
  }
}

exports.getUserById = (req, res) => {
  const { id } = req.query;
  User.findById(id).then(function(user) {
    if (!user) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, user: getUserFields(user) });
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
        accum[user._id] = getUserFields(user);
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
      bcrypt.compare(password, user.password, function (error, result) {
        if (result) {
          return res.json({ success: true, user: getUserFields(user) });
        } else {
          return res.json({ success: false, error });
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
        accum[user._id] = getUserFields(user);
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
      bcrypt.hash(password, saltRounds, function (error, hash) {
        const user = new User({
          firstName, lastName, username,
          password: hash,
          profileImageId: null
        });
        user.save(error => {
          if (error) return res.json({ success: false, error });
          return res.json({ success: true, user: getUserFields(user) });
        });
      });
    }
  });
}

exports.updateProfile = (req, res) => {
  const { id, profileImageId, firstName, lastName, username } = req.body;
  const profileImageIdUpdate = !!profileImageId ? { profileImageId } : {};
  const firstNameUpdate = !!firstName ? { firstName } : {};
  const lastNameUpdate = !!lastName ? { lastName } : {};
  const usernameUpdate = !!username ? { username } : {};
  User.findByIdAndUpdate(id, {
    ...profileImageIdUpdate,
    ...firstNameUpdate,
    ...lastNameUpdate,
    ...usernameUpdate
  }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  });
}

exports.updateCreatedRecipeIds = (req, res) => {
  const { id, createdRecipeIds } = req.body;
  User.findByIdAndUpdate(id, { createdRecipeIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  });
}

exports.updateLikedRecipeIds = (req, res) => {
  const { id, likedRecipeIds } = req.body;
  User.findByIdAndUpdate(id, { likedRecipeIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  });
}

exports.updateFollowerIds = (req, res) => {
  const { id, followerIds } = req.body;
  User.findByIdAndUpdate(id, { followerIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  })
}

exports.updateFollowingIds = (req, res) => {
  const { id, followingIds } = req.body;
  User.findByIdAndUpdate(id, { followingIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  })
}