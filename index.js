const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./server/userRoutes");
const recipeRoutes = require("./server/recipeRoutes");
const imageRoutes = require("./server/imageRoutes");
const iconRoutes = require("./server/iconRoutes");
const app = express();
const router = express.Router();

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")));

router.get("/getUserById", userRoutes.getUserById);
router.get("/getUsersByIds", userRoutes.getUsersByIds);
router.get("/getUser", userRoutes.getUser);
router.get("/getAllUsers", userRoutes.getAllUsers);
router.post("/createUser", userRoutes.createUser);
router.post("/updateProfile", userRoutes.updateProfile);
router.post("/updateCreatedRecipeIds", userRoutes.updateCreatedRecipeIds);
router.post("/updateLikedRecipeIds", userRoutes.updateLikedRecipeIds);
router.post("/updateFollowerIds", userRoutes.updateFollowerIds);
router.post("/updateFollowingIds", userRoutes.updateFollowingIds);
router.post("/deleteUser", userRoutes.deleteUser);

router.get("/getRecipesByTime", recipeRoutes.getRecipesByTime);
router.get("/getRecipesByIds", recipeRoutes.getRecipesByIds);
router.get("/getRecipeDetail", recipeRoutes.getRecipeDetail);
router.post("/createRecipe", recipeRoutes.createRecipe);
router.post("/updateRecipe", recipeRoutes.updateRecipe);
router.post("/deleteRecipe", recipeRoutes.deleteRecipe);
router.post(
  "/randomizeAnonymousRecipes",
  recipeRoutes.randomizeAnonymousRecipes
);

router.get("/getImageById", imageRoutes.getImageById);
router.post("/createImage", imageRoutes.createImage);
router.post("/updateImage", imageRoutes.updateImage);

router.get("/getIcons", iconRoutes.getIcons);

app.use("/api", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
