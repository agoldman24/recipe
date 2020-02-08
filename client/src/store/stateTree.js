import { RECIPE_TAB } from "../variables/Constants";

export default Object.assign({},
  {
    activeTab: RECIPE_TAB,
    isSpinnerVisible: false,
    activeRecipe: {
      id: "",
      name: "",
      image: "",
      ingredients: [],
      directions: ""
    },
    viewedRecipeIds: [],
    isDetailVisible: false,
    usernameExists: false,
    emptyFields: false,
    isLoggedIn: false,
    loginFailed: false,
    networkFailed: false,
    activeUser: {
      id: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      favorites: []
    },
    newUserData: {
      firstName: "",
      lastName: "",
      username: "",
      password: ""
    }
  });