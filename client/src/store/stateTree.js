import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: WELCOME_TAB,
  isSpinnerVisible: false,
  isDetailVisible: false,
  usersFetched: false,
  isHydrated: false,
  tabHistory: [],
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
    followerIds: [],
    followingIds: [],
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
    followerIds: [],
    followingIds: [],
    draftRecipeIds: [],
    createdRecipeIds: [],
    savedRecipeIds: []
  },
  displayUserDetail: {
    profileImage: null,
    followers: {},
    following: {},
    createdRecipes: {},
    savedRecipes: {},
    activeDetail: ""
  },
  recipe: {
    id: "",
    name: "",
    image: null,
    ingredients: [],
    directions: ""
  },
  ingredient: {
    item: "",
    quantity: ""
  },
  sampleRecipes: {},
  detailRecipeId: "",
  allRecipesFetched: {
    samples: false,
    saved: false
  }
});