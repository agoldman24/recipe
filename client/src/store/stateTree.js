import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: WELCOME_TAB,
  activeRecipes: {},
  viewedRecipeIds: [],
  detailRecipeId: "",
  isSpinnerVisible: false,
  isDetailVisible: false,
  isLoggedIn: false,
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
    profileImage: null,
    friendIds: [],
    draftRecipeIds: [],
    createdRecipeIds: [],
    savedRecipeIds: []
  },
  displayUser: {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    profileImage: null,
    friendIds: [],
    draftRecipeIds: [],
    createdRecipeIds: [],
    savedRecipeIds: []
  },
  displayUserDetail: {
    friends: {},
    createRecipes: {},
    savedRecipes: {}
  }
});