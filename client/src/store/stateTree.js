import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: WELCOME_TAB,
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
    lastName: "",
    friendIds: [],
    createdRecipeIds: [],
    friendRecipeIds: [],
    sampleRecipeIds: []
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