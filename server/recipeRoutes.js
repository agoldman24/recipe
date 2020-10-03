const Recipe = require('./recipe');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;

const getDerivedRecipe = recipe => {
  const {
    _id, name, image, ingredients, directions,
    authorName, authorId
  } = recipe;
  return {
    id: _id, name, image, ingredients, directions,
    authorName, authorId
  }
}

exports.createRecipe = (req, res) => {
  const {
    name, image, ingredients, directions,
    authorName, authorId
  } = req.body;
  const recipe = new Recipe({
    name, image, ingredients, directions,
    authorName, authorId
  });
  recipe.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, recipe: getDerivedRecipe(recipe) });
  });
}

exports.getSamples = (req, res) => {
  const idArray = !!req.query.ids
    ? req.query.ids.split(',').map(id => ObjectID(id))
    : [];
  db.collection("recipes").find(
    { _id: { $nin: idArray } }
  ).toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.filter(r => !r.authorId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 9)
        .reduce((accum, recipe) => {
          accum[recipe._id] = getDerivedRecipe(recipe);
          return accum;
        }, {})
    })
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
    .slice(0, 9);
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
          ...getDerivedRecipe(recipe),
          timestamp: parseInt(idTimeMap[recipe._id])
        };
        return accum;
      }, {})
    })
  })
}