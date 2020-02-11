import { RECIPE_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: RECIPE_TAB,
  isSpinnerVisible: false,
  activeRecipes: {},
  viewedRecipeIds: [],
  isDetailVisible: false,
  detailRecipeId: "",
  usernameExists: false,
  emptyFields: false,
  isLoggedIn: !!localStorage.getItem("username"),
  loginFailed: false,
  networkFailed: false,
  isSnackbarVisible: false,
  activeUser: {
    id: "",
    firstName: "",
    lastName: "",
    username: ""
  },
  newUserData: {
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  }
});