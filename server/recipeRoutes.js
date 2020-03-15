const Recipe = require('./recipe');
const db = require('./database');

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
  db.collection("recipes").aggregate([
    { $match: { isSample: true } },
    { $sample: { size: 10 } }
  ]).toArray().then(recipes => {
    return res.json({
      success: true,
      recipes: recipes.reduce((accum, recipe) => {
        accum[recipe._id] = getDerivedRecipe(recipe);
        return accum;
      }, {})
    })
  })
}