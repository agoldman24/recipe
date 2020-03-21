const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const userRoutes = require('./server/userRoutes');
const recipeRoutes = require('./server/recipeRoutes');
const app = express();
const router = express.Router();

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

router.get("/getUserById", userRoutes.getUserById);
router.get("/getUser", userRoutes.getUser);
router.get("/getAllUsers", userRoutes.getAllUsers);
router.post("/createUser", userRoutes.createUser);
router.post("/updateProfileImage", userRoutes.updateProfileImage);
router.post("/updateSavedRecipeIds", userRoutes.updateSavedRecipeIds);
router.get("/getUsersByIds", userRoutes.getUsersByIds);

router.post("/createRecipe", recipeRoutes.createRecipe);
router.get("/getSamples", recipeRoutes.getSamples);
router.get("/getRecipesByIds", recipeRoutes.getRecipesByIds);

app.use("/api", router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));