import { RECIPE_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: RECIPE_TAB,
  activeRecipes: {},
  viewedRecipeIds: [],
  detailRecipeId: "",
  isSpinnerVisible: false,
  isDetailVisible: false,
  isLoggedIn: !!localStorage.getItem("username"),
  snackbar: {
    isVisible: false,
    message: ""
  },
  errorMessages: {
    emptyFields: false,
    usernameExists: false,
    loginFailed: false,
    networkFailed: false
  },
  users: {},
  activeUser: {
    id: "",
    username: "",
    firstName: "",
    lastName: ""
  },
  displayUser: {
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    friends: {},
    createdRecipes: {},
    savedRecipes: {}
  }
});