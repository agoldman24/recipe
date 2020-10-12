const Recipe = require('./recipe');
const db = require('./database');
const ObjectID = require('mongodb').ObjectID;

const getRecipeSummary = recipe => {
  const { _id, name, image, authorName, authorId } = recipe;
  return {
    id: _id, name, image, authorName, authorId
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
    return res.json({ success: true, recipe: getRecipeSummary(recipe) });
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
        .slice(0, 20)
        .reduce((accum, recipe) => {
          accum[recipe._id] = getRecipeSummary(recipe);
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
  db.collection("recipes").findOne({
    _id: ObjectID(req.query.id)
  }).then(recipe => {
    return res.json({
      success: true,
      ingredients: recipe.ingredients,
      directions: recipe.directions
    })
  })
}