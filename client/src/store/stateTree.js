import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: { name: WELCOME_TAB },
  isSpinnerVisible: false,
  isDetailVisible: false,
  isDrawerMenuVisible: false,
  isHydrated: false,
  usersFetched: false,
  profileEditor: null,
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
  detailRecipe: {
    id: "",
    editMode: false,
    addRowMode: false
  },
  allRecipesFetched: {
    samples: false,
    created: false,
    saved: false
  }
});