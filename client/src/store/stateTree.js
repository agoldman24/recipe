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
  isLoggedIn: false,
  loginFailed: false,
  networkFailed: false,
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