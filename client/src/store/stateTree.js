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
    isLoggedIn: false,
    activeUser: {
      id: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      favorites: []
    },
    isNewUserFormVisible: false,
    newUserData: {
      firstName: "",
      lastName: "",
      username: "",
      password: ""
    }
  });