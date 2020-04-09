const Recipe = require('./recipe');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;

const getDerivedRecipe = recipe => {
  const {
    _id, name, image, ingredients, directions,
    authorName, authorId, isSample
  } = recipe;
  return {
    id: _id, name, image, ingredients, directions,
    authorName, authorId, isSample
  }
}

exports.createRecipe = (req, res) => {
  const {
    name, image, ingredients, directions,
    authorName, authorId, isSample
  } = req.body;
  const recipe = new Recipe({
    name, image, ingredients, directions,
    authorName, authorId, isSample
  });
  recipe.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
}

exports.getSamples = (req, res) => {
  const idArray = !!req.query.ids
    ? req.query.ids.split(',').map(id => ObjectID(id))
    : [];
  db.collection("recipes").find(
    { _id: { $nin: idArray } },
    { isSample: true }
  ).toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.sort(() => 0.5 - Math.random()).slice(0, 10).reduce((accum, recipe) => {
        accum[recipe._id] = getDerivedRecipe(recipe);
        return accum;
      }, {})
    })
  })
}

exports.getRecipesByIds = (req, res) => {
  const ids = req.query.ids.split(',').map(id => ObjectID(id));
  const timestamps = req.query.timestamps.split(',');
  const timestampMap = ids.reduce((accum, id, index) => {
    accum[id] = timestamps[index];
    return accum;
  }, {});
  db.collection("recipes").find(
    { _id: { $in: ids } }
  ).toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.slice(0, 10).reduce((accum, recipe) => {
        accum[recipe._id] = {
          ...getDerivedRecipe(recipe),
          timestamp: parseInt(timestampMap[recipe._id])
        };
        return accum;
      }, {})
    })
  })
}