const User = require("./user");
const Recipe = require("./recipe");
const Image = require("./image");
const db = require("./database");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUserSummary = (user) => {
  const { _id, username, firstName, lastName, timestamp } = user;
  return { id: _id, username, firstName, lastName, timestamp };
};

const getUserFields = (user) => {
  const {
    _id,
    username,
    firstName,
    lastName,
    profileImageId,
    timestamp,
    followerIds,
    followingIds,
    createdRecipeIds,
    likedRecipeIds,
  } = user;
  return {
    id: _id,
    username,
    firstName,
    lastName,
    profileImageId,
    timestamp,
    followerIds,
    followingIds,
    createdRecipeIds,
    likedRecipeIds,
  };
};

exports.getUserById = (req, res) => {
  const { id } = req.query;
  User.findById(id).then((user) => {
    if (!user) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, user: getUserFields(user) });
    }
  });
};

exports.getUsersByIds = (req, res) => {
  const idArray = req.query.ids.split(",");
  if (idArray.length === 1 && !idArray[0].length) {
    return res.json({
      success: true,
      users: [],
    });
  }
  db.collection("users")
    .find({ _id: { $in: idArray.map((id) => ObjectID(id)) } })
    .toArray()
    .then((users) => {
      return res.json({
        success: true,
        users: users.reduce((accum, user) => {
          accum[user._id] = getUserFields(user);
          return accum;
        }, {}),
      });
    });
};

exports.getUser = (req, res) => {
  const { username, password } = req.query;
  db.collection("users")
    .findOne({ username })
    .then((user) => {
      if (!user) {
        return res.json({ success: false });
      } else {
        bcrypt.compare(password, user.password, (error, result) => {
          if (result) {
            return res.json({ success: true, user: getUserFields(user) });
          } else {
            return res.json({ success: false, error });
          }
        });
      }
    });
};

exports.getAllUsers = (req, res) => {
  db.collection("users")
    .find({}, {})
    .sort({ timestamp: -1 })
    .toArray()
    .then((users) => {
      return res.json({
        success: true,
        users: users.reduce((accum, user) => {
          accum[user._id] = getUserSummary(user);
          return accum;
        }, {}),
      });
    });
};

exports.createUser = (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  db.collection("users")
    .findOne({ username })
    .then((user) => {
      if (user) {
        return res.json({ success: false });
      } else {
        bcrypt.hash(password, saltRounds, (e, hash) => {
          const user = new User({
            firstName,
            lastName,
            username,
            password: hash,
            profileImageId: null,
            timestamp: Date.now(),
          });
          user.save((error) => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true, user: getUserFields(user) });
          });
        });
      }
    });
};

exports.updateProfile = (req, res) => {
  const { id, profileImageId, firstName, lastName, username } = req.body;
  const profileImageIdUpdate = !!profileImageId ? { profileImageId } : {};
  const firstNameUpdate = !!firstName ? { firstName } : {};
  const lastNameUpdate = !!lastName ? { lastName } : {};
  const usernameUpdate = !!username ? { username } : {};
  User.findByIdAndUpdate(
    id,
    {
      ...profileImageIdUpdate,
      ...firstNameUpdate,
      ...lastNameUpdate,
      ...usernameUpdate,
    },
    { new: true },
    (error, user) => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true, user: getUserFields(user) });
    }
  );
};

exports.updateCreatedRecipeIds = (req, res) => {
  const { id, recipeId, keep } = req.body;
  User.findById(id).then((user) => {
    const createdRecipeIds = keep
      ? [...user.createdRecipeIds, { id: recipeId, timestamp: Date.now() }]
      : user.createdRecipeIds.filter((obj) => obj.id !== recipeId);
    User.findByIdAndUpdate(
      id,
      { createdRecipeIds },
      { new: true },
      (error, user) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, user: getUserFields(user) });
      }
    );
  });
};

exports.updateLikedRecipeIds = (req, res) => {
  const { id, recipeId, keep } = req.body;
  User.findById(id).then((user) => {
    Recipe.findById(recipeId).then((recipe) => {
      const likedByIds = keep
        ? [...recipe.likedByIds, id]
        : recipe.likedByIds.filter((i) => i !== id);
      Recipe.findByIdAndUpdate(recipeId, { likedByIds }, {}, (error) => {
        if (error) return res.json({ success: false, error });
      });
    });
    const likedRecipeIds = keep
      ? [...user.likedRecipeIds, { id: recipeId, timestamp: Date.now() }]
      : user.likedRecipeIds.filter((obj) => obj.id !== recipeId);
    User.findByIdAndUpdate(
      id,
      { likedRecipeIds },
      { new: true },
      (error, user) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, user: getUserFields(user) });
      }
    );
  });
};

exports.updateFollowerIds = (req, res) => {
  const { id, followerIds } = req.body;
  User.findByIdAndUpdate(id, { followerIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  });
};

exports.updateFollowingIds = (req, res) => {
  const { id, followingIds } = req.body;
  User.findByIdAndUpdate(id, { followingIds }, { new: true }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, user: getUserFields(user) });
  });
};

exports.deleteUser = (req, res) => {
  const {
    id,
    profileImageId,
    followingIds,
    followerIds,
    likedRecipeIds,
    createdRecipeIds,
  } = req.body.user;
  Image.findByIdAndRemove(profileImageId, (error) => {
    if (error) return res.json({ success: false, error });
  });
  followingIds.forEach((followingId) => {
    User.findById(followingId).then((user) => {
      const followerIds = user.followerIds.filter((i) => i !== id);
      User.findByIdAndUpdate(followingId, { followerIds }, {}, (error) => {
        if (error) return res.json({ success: false, error });
      });
    });
  });
  followerIds.forEach((followerId) => {
    User.findById(followerId).then((user) => {
      const followingIds = user.followingIds.filter((i) => i !== id);
      User.findByIdAndUpdate(followerId, { followingIds }, {}, (error) => {
        if (error) return res.json({ success: false, error });
      });
    });
  });
  likedRecipeIds.forEach((likedRecipeId) => {
    Recipe.findById(likedRecipeId.id).then((recipe) => {
      const likedByIds = recipe.likedByIds.filter((i) => i !== id);
      Recipe.findByIdAndUpdate(
        likedRecipeId.id,
        { likedByIds },
        {},
        (error) => {
          if (error) return res.json({ success: false, error });
        }
      );
    });
  });
  createdRecipeIds.forEach((createdRecipeId) => {
    Recipe.findById(createdRecipeId.id).then((recipe) => {
      recipe.likedByIds.forEach((userId) => {
        User.findById(userId).then((user) => {
          const likedRecipeIds = user.likedRecipeIds.filter(
            (obj) => obj.id !== id
          );
          User.findByIdAndUpdate(userId, { likedRecipeIds }, {}, (error) => {
            if (error) return res.json({ success: false, error });
          });
        });
      });
    });
    Recipe.findByIdAndRemove(createdRecipeId.id, (error) => {
      if (error) return res.json({ success: false, error });
    });
  });
  User.findByIdAndRemove(id, (error) => {
    if (error) return res.json({ success: false, error });
  });
  return res.json({ success: true });
};
