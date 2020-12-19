const Recipe = require('./recipe');
const User = require('./user');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;

const getRecipeSummary = recipe => {
  const { _id, name, image, authorName, authorId, timestamp } = recipe;
  return { id: _id, name, image, authorName, authorId, timestamp }
}

const getRecipeFields = recipe => {
  const { name, image, ingredients, directions } = recipe;
  return { name, image, ingredients, directions }
}

exports.createRecipe = (req, res) => {
  const { name, image, ingredients, directions, authorName, authorId } = req.body;
  const recipe = new Recipe({
    name, image, ingredients, directions, authorName, authorId,
    likedByIds: [], timestamp: Date.now()
  });
  recipe.save(error => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, recipe: getRecipeSummary(recipe) });
  });
}

exports.updateRecipe = (req, res) => {
  const { id, name, image, ingredients, directions } = req.body;
  Recipe.findByIdAndUpdate(id, {
    name, image, ingredients, directions
  }, { new: true }, (error, recipe) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, recipe: getRecipeFields(recipe) });
  });
}

exports.deleteRecipe = (req, res) => {
  Recipe.findById(req.body.id).then(recipe => {
    const { authorId, likedByIds } = recipe;
    User.findById(authorId).then(user => {
      const createdRecipeIds = user.createdRecipeIds.filter(({ id }) => id !== req.body.id);
      User.findByIdAndUpdate(authorId, { createdRecipeIds }, {}, error => {
        if (error) return res.json({ success: false, error });
      });
    });
    likedByIds.forEach(userId => {
      User.findById(userId).then(user => {
        const likedRecipeIds = user.likedRecipeIds.filter(({ id }) => id !== req.body.id);
        User.findByIdAndUpdate(userId, { likedRecipeIds }, {}, error => {
          if (error) return res.json({ success: false, error });
        });
      })
    });
    Recipe.findByIdAndRemove(req.body.id, error => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true, likedByIds });
    });
  });
}

exports.getRecipesByTime = (req, res) => {
  db.collection("recipes").find({
    timestamp: { $lt: parseInt(req.query.timestamp) }
  }).sort({ timestamp: -1 })
  .limit(20)
  .toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.map(recipe => getRecipeSummary(recipe))
    });
  })
}

exports.getRecipesByIds = (req, res) => {
  const ids = req.query.ids.split(',');
  const timestamps = req.query.timestamps.split(',')
    .map((timestamp, index) => {
      return {
        timestamp,
        id: ids[index]
      }
    });
  const sortedArray = timestamps
    .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
    .slice(0, 20);
  const idTimeMap = sortedArray.reduce((accum, obj) => {
    accum[obj.id] = obj.timestamp;
    return accum;
  }, {});
  db.collection("recipes").find(
    { _id: { $in: Object.keys(idTimeMap).map(id => ObjectID(id)) } }
  ).toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.reduce((accum, recipe) => {
        accum[recipe._id] = {
          ...getRecipeSummary(recipe),
          timestamp: parseInt(idTimeMap[recipe._id])
        };
        return accum;
      }, {})
    })
  })
}

exports.getRecipeDetail = (req, res) => {
  Recipe.findById(req.query.id).then(recipe => {
    return res.json({
      success: true,
      ingredients: recipe.ingredients,
      directions: recipe.directions
    })
  })
}