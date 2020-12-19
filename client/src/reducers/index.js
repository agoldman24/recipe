import { combineReducers } from 'redux';
import { b64toBlob } from '../utilities/imageConverter';
import StateTree from './stateTree';
import {
  INIT_HYDRATION,
  COMPLETE_HYDRATION,
  SIGN_UP_REQUESTED,
  SIGN_IN_REQUESTED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  DELETE_USER_REQUESTED,
  DELETE_USER_SUCCEEDED,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  POPULATE_USERS,
  ADD_USER,
  UPDATE_USERS,
  UPDATE_TWO_USERS,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  SET_DISPLAY_USER_DETAIL,
  SET_ACTIVE_DETAIL,
  UPDATE_DISPLAY_USER_DETAIL,
  GET_RECIPES_REQUESTED,
  CREATE_RECIPE_REQUESTED,
  UPDATE_RECIPE_REQUESTED,
  DELETE_RECIPE_REQUESTED,
  UPDATE_DETAIL_RECIPE,
  DELETE_RECIPE,
  ADD_CREATED_RECIPE,
  APPEND_ALL_RECIPES,
  APPEND_FRIEND_RECIPES,
  APPEND_CREATED_RECIPES,
  APPEND_LIKED_RECIPES,
  SET_RECIPE_CATEGORY,
  SET_DETAIL_RECIPE,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES,
  USERNAME_EXISTS,
  EMPTY_FIELDS,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  TOGGLE_PROFILE_EDITOR,
  UPDATE_PROFILE_EDITOR,
  TOGGLE_RECIPE_EDIT_MODE,
  TOGGLE_IS_POSTING
} from '../actions';
import {
  RECIPE_TAB,
  PROFILE_TAB,
  CREATED_RECIPE_IDS,
  CREATED_RECIPES,
  LIKED_RECIPE_IDS,
  LIKED_RECIPES,
  DISPLAY_USER,
  FOLLOWERS,
  PROFILE,
  PUSH,
  FOLLOWING_IDS
} from '../variables/Constants';

const isDefined = v => !!v && v !== "null" && v !== "undefined";

const isSpinnerVisible = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case INIT_HYDRATION:
    case SIGN_UP_REQUESTED:
    case SIGN_IN_REQUESTED:
    case GET_USER_DETAIL_REQUESTED:
    case CREATE_RECIPE_REQUESTED:
    case UPDATE_RECIPE_REQUESTED:
    case DELETE_RECIPE_REQUESTED:
    case DELETE_USER_REQUESTED:
    case SET_RECIPE_CATEGORY:
      return true;
    case SET_ACTIVE_TAB:
      return action.newTab.name === RECIPE_TAB
    case UPDATE_USER_REQUESTED:
      return action.updateType === PROFILE || action.updateType === CREATED_RECIPE_IDS
    case COMPLETE_HYDRATION:
    case GET_USER_DETAIL_SUCCEEDED:
    case UPDATE_USER_SUCCEEDED:
    case DELETE_USER_SUCCEEDED:
    case APPEND_ALL_RECIPES:
    case APPEND_FRIEND_RECIPES:
    case APPEND_CREATED_RECIPES:
    case UPDATE_DETAIL_RECIPE:
    case DELETE_RECIPE:
    case NETWORK_FAILED:
    case SIGN_IN_FAILED:
    case USERNAME_EXISTS:
    case SHOW_SNACKBAR:
      return false;
    default:
      return state;
  }
}

const isHydrated = (state = StateTree.isHydrated, action) => {
  switch (action.type) {
    case COMPLETE_HYDRATION:
      return true;
    default:
      return state;
  }
}

const errorMessages = (state = StateTree.errorMessages, action) => {
  switch (action.type) {
    case SIGN_IN_FAILED:
      return { ...state, loginFailed: true }
    case NETWORK_FAILED:
      return { ...state, networkFailed: true }
    case USERNAME_EXISTS:
      return { ...state, usernameExists: true }
    case EMPTY_FIELDS:
      return { ...state, emptyFields: true }
    case CLEAR_ERROR_MESSAGES:
      return {
        loginFailed: false,
        networkFailed: false,
        usernameExists: false,
        emptyFields: false
      }
    default:
      return state
  }
}

export const snackbar = (state = StateTree.snackbar, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        isVisible: true,
        message: action.message
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        isVisible: false
      };
    default:
      return state;
  }
}

const activeTab = (state = StateTree.activeTab, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      document.getElementById('root').scrollTo(0, 0);
      document.getElementById('container').scrollTo(0, 0);
      localStorage.setItem("activeTab", action.newTab.name);
      return action.newTab;
    default:
      return state;
  }
}

const tabHistory = (state = StateTree.tabHistory, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return !!action.currentTab
        ? action.operation === PUSH
          ? [ ...state, action.currentTab ]
          : state.filter((tab, index) => index < state.length - 1)
        : []
    default:
      return state;
  }
}

const users = (state = StateTree.users, action) => {
  switch (action.type) {
    case POPULATE_USERS:
    case UPDATE_USERS:
      return action.users;
    case ADD_USER:
    case SET_ACTIVE_USER:
    case SET_DISPLAY_USER:
    case UPDATE_DISPLAY_USER_DETAIL:
      return {
        ...state,
        [action.user.id]: action.user
      }
    case UPDATE_TWO_USERS:
      return {
        ...state,
        [action.user.id]: action.user,
        [action.user2.id]: action.user2
      }
    case DELETE_USER_SUCCEEDED:
      const newState = { ...state };
      delete newState[action.deletedUserId];
      return newState;
    case DELETE_RECIPE:
      const usersUpdate = action.likedByIds.reduce((accum, userId) => {
        accum[userId] = {
          ...state[userId],
          likedRecipeIds: state[userId].likedRecipeIds.filter(({ id }) => id !== action.id)
        }
        return accum;
      }, {});
      return {
        ...state,
        ...usersUpdate,
        [action.authorId]: {
          ...state[action.authorId],
          createdRecipeIds: state[action.authorId].createdRecipeIds.filter(({ id }) => id !== action.id)
        }
      }
    default:
      return state;
  }
}

const usersFetched = (state = StateTree.usersFetched, action) => {
  switch (action.type) {
    case POPULATE_USERS:
      return true;
    default:
      return state;
  }
}

const activeUser = (state = null, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      localStorage.setItem("activeUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case PROFILE:
          return {
            ...state,
            profileImageId: action.user.profileImageId,
            firstName: action.user.firstName,
            lastName: action.user.lastName,
            username: action.user.username
          }
        default:
          return state;
      }
    case DELETE_RECIPE:
      return {
        ...state,
        createdRecipeIds: state.createdRecipeIds.filter(({ id }) => id !== action.id),
        likedRecipeIds: state.likedRecipeIds.filter(({ id }) => id !== action.id)
      }
    case SIGN_OUT:
      localStorage.clear();
      return null;
    default:
      return state;
  }
}

const displayUser = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      localStorage.setItem("displayUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case CREATED_RECIPE_IDS:
          return {
            ...state,
            createdRecipeIds: action.user.createdRecipeIds
          }
        case LIKED_RECIPES:
          return {
            ...state,
            likedRecipeIds: action.user.likedRecipeIds
          }
        case FOLLOWERS:
          return {
            ...state,
            followerIds: action.user2.followerIds
          }
        case PROFILE:
          return {
            ...state,
            profileImageId: action.user.profileImageId,
            firstName: action.user.firstName,
            lastName: action.user.lastName,
            username: action.user.username
          }
        default:
          return state;
      }
    case DELETE_RECIPE:
      if (!!state) {
        return {
          ...state,
          createdRecipeIds: state.createdRecipeIds.filter(({ id }) => id !== action.id),
          likedRecipeIds: state.likedRecipeIds.filter(({ id }) => id !== action.id)
        }
      }
      return state;
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        return null;
      } else {
        return state;
      }
    default:
      return state;
  }
}

const displayUserDetail = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      return null;
    case SET_DISPLAY_USER_DETAIL:
      const { profileImage, followers, following, createdRecipes, likedRecipes } = action;
      const cachedActiveDetail = localStorage.getItem("activeDetail");
      const activeDetail = action.activeUserIsDisplayUser
        ? isDefined(cachedActiveDetail)
          ? cachedActiveDetail
          : FOLLOWERS
        : FOLLOWERS;
      localStorage.setItem("activeDetail", activeDetail);
      return {
        profileImage, followers, following, createdRecipes, likedRecipes, activeDetail
      };
    case SET_ACTIVE_DETAIL:
      localStorage.setItem("activeDetail", action.detail);
      return {
        ...state,
        activeDetail: action.detail
      };
    case APPEND_LIKED_RECIPES:
      return !state ? state : {
        ...state,
        likedRecipes: {
          ...state.likedRecipes,
          ...action.recipes
        }
      }
    case APPEND_CREATED_RECIPES:
      return !!state && action.appendTo === DISPLAY_USER
      ? {
          ...state,
          createdRecipes: {
            ...state.createdRecipes,
            ...action.recipes
          }
        }
      : state;
    case DELETE_RECIPE:
      if (!!state) {
        const newState = { ...state };
        delete newState.likedRecipes[action.id];
        return newState;
      }
      return state;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case LIKED_RECIPES:
          return {
            ...state,
            likedRecipes: action.keep
              ? { ...state.likedRecipes, [action.recipe.id]: action.recipe }
              : Object.keys(state.likedRecipes).filter(id => id !== action.recipe.id)
                .reduce((accum, id) => {
                  accum[id] = state.likedRecipes[id];
                  return accum;
                }, {})
          }
        case FOLLOWERS:
          return {
            ...state,
            followers: action.keep
              ? { ...state.followers, [action.user.id]: action.user }
              : Object.keys(state.followers).filter(id => id !== action.user.id)
                .reduce((accum, id) => {
                  accum[id] = state.followers[id];
                  return accum;
                }, {}),
            following: Object.keys(state.following).includes(action.user2.id)
              ? {
                  ...state.following,
                  [action.user.id]: action.user
                }
              : state.following
          }
        case PROFILE:
          return {
            ...state,
            profileImage: !!action.imageData
              ? URL.createObjectURL(b64toBlob(action.imageData))
              : state.profileImage
          }
        default:
          return state;
      }
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        if (!!state && !!state.profileImage) {
          URL.revokeObjectURL(state.profileImage);
        }
        return null;
      }
      return state;
    default:
      return state;
  }
}

const profileEditor = (state = StateTree.profileEditor, action) => {
  switch (action.type) {
    case TOGGLE_PROFILE_EDITOR:
      return !!action.firstName
        ? {
            firstName: action.firstName,
            lastName: action.lastName,
            username: action.username,
            profileImage: action.profileImage
          }
        : null;
    case UPDATE_PROFILE_EDITOR:
      if (!!action.imageUrl) {
        return {
          ...state,
          profileImage: action.imageUrl
        }
      }
      else if (!!action.firstName) {
        return {
          ...state,
          firstName: action.firstName
        }
      }
      else if (!!action.lastName) {
        return {
          ...state,
          lastName: action.lastName
        }
      }
      else if (!!action.username) {
        return {
          ...state,
          username: action.username
        }
      }
      return state;
    default:
      return state;
  }
}

const recipeCategory = (state = StateTree.recipeCategory, action) => {
  switch (action.type) {
    case SET_RECIPE_CATEGORY:
      localStorage.setItem("recipeCategory", action.category);
      return action.category;
    case SIGN_OUT:
      return StateTree.recipeCategory;
    default:
      return state;
  }
}

const recipeEditMode = (state = StateTree.recipeEditMode, action) => {
  switch (action.type) {
    case TOGGLE_RECIPE_EDIT_MODE:
      return !state;
    default:
      return state;
  }
}

const detailRecipe = (state = StateTree.detailRecipe, action) => {
  switch (action.type) {
    case SET_DETAIL_RECIPE:
    case UPDATE_DETAIL_RECIPE:
      return action.recipe;
    case DELETE_RECIPE:
      return null
    default:
      return state;
  }
}

const allRecipes = (state = StateTree.allRecipes, action) => {
  let newState;
  switch (action.type) {
    case APPEND_ALL_RECIPES:
      return {
        ...state,
        ...action.recipes.reduce((accum, recipe) => {
          accum[recipe.id] = recipe;
          return accum;
        }, {})
      }
    case UPDATE_DETAIL_RECIPE:
      newState = { ...state };
      if (!!state[action.recipe.id]) {
        newState[action.recipe.id] = action.recipe
      }
      return newState;
    case DELETE_RECIPE:
      newState = { ...state };
      delete newState[action.id];
      return newState;
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

const oldestFetchedTimestamp = (state = StateTree.oldestFetchedTimestamp, action) => {
  switch (action.type) {
    case APPEND_ALL_RECIPES:
      return !!action.recipes.length
        ? action.recipes[action.recipes.length - 1].timestamp
        : state;
    case SET_RECIPE_CATEGORY:
    case SET_ACTIVE_TAB:
    case SIGN_OUT:
      return Date.now();
    default:
      return state;
  }
}

const refreshNeeded = (state = StateTree.refreshNeeded, action) => {
  switch (action.type) {
    case APPEND_ALL_RECIPES:
    case APPEND_FRIEND_RECIPES:
    case APPEND_CREATED_RECIPES:
      return false;
    case SET_RECIPE_CATEGORY:
      return true;
    case SET_ACTIVE_TAB:
      return action.newTab.name === RECIPE_TAB
    default:
      return state;
  }
}

const friendRecipes = (state = StateTree.friendRecipes, action) => {
  switch (action.type) {
    case APPEND_FRIEND_RECIPES:
      return {
        ...state,
        ...action.recipes
      }
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

const createdRecipes = (state = StateTree.createdRecipes, action) => {
  switch (action.type) {
    case ADD_CREATED_RECIPE:
      return {
        ...state,
        [action.recipe.id]: {
          ...action.recipe,
          timestamp: Date.now()
        }
      }
    case UPDATE_DETAIL_RECIPE:
      return {
        ...state,
        [action.recipe.id]: {
          ...state[action.recipe.id],
          ...action.recipe
        }
      }
    case APPEND_CREATED_RECIPES:
      return action.appendTo === CREATED_RECIPES
      ? {
          ...state,
          ...action.recipes
        }
      : state;
    case DELETE_RECIPE:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

const isLiking = (state = StateTree.isLiking, action) => {
  switch (action.type) {
    case UPDATE_USER_REQUESTED:
      return action.updateType === LIKED_RECIPE_IDS;
    case UPDATE_USER_SUCCEEDED:
      return false;
    default:
      return state;
  }
}

const isPosting = (state = StateTree.isPosting, action) => {
  switch (action.type) {
    case TOGGLE_IS_POSTING:
      return !state;
    default:
      return state;
  }
}

const isUpdatingFollowers = (state = StateTree.isUpdatingFollowers, action) => {
  switch (action.type) {
    case UPDATE_USER_REQUESTED:
      return action.updateType === FOLLOWING_IDS;
    case UPDATE_USER_SUCCEEDED:
      return false;
    default:
      return state;
  }
}

const isFetchingRecipes = (state = StateTree.isFetchingRecipes, action) => {
  switch (action.type) {
    case GET_RECIPES_REQUESTED:
      return true;
    case APPEND_CREATED_RECIPES:
    case APPEND_FRIEND_RECIPES:
    case APPEND_LIKED_RECIPES:
    case APPEND_ALL_RECIPES:
      return false;
    default:
      return state;
  }
}

const recipesFetched = (state = StateTree.recipesFetched, action) => {
  switch (action.type) {
    case APPEND_ALL_RECIPES:
      return {
        ...state,
        all: action.recipes.length < 20
      }
    case APPEND_FRIEND_RECIPES:
      return {
        ...state,
        friends: Object.keys(action.recipes).length < 20
      }
    case APPEND_CREATED_RECIPES:
      return action.appendTo === CREATED_RECIPES
      ? {
          ...state,
          created: Object.keys(action.recipes).length < 20
        }
      : {
          ...state,
          displayUserCreated: Object.keys(action.recipes).length < 20
        }
    case APPEND_LIKED_RECIPES:
      return {
        ...state,
        liked: Object.keys(action.recipes).length < 20
      }
    case SET_DISPLAY_USER_DETAIL:
      return {
        ...state,
        created: !action.activeUserIsDisplayUser
          ? Object.keys(action.createdRecipes).length < 20
          : state.created,
        liked: Object.keys(action.likedRecipes).length < 20
      }
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        return {
          ...state,
          liked: false
        }
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  activeTab,
  tabHistory,
  isSpinnerVisible,
  profileEditor,
  isHydrated,
  errorMessages,
  snackbar,
  users,
  usersFetched,
  activeUser,
  displayUser,
  displayUserDetail,
  recipeCategory,
  recipeEditMode,
  detailRecipe,
  allRecipes,
  oldestFetchedTimestamp,
  refreshNeeded,
  friendRecipes,
  createdRecipes,
  isLiking,
  isPosting,
  isUpdatingFollowers,
  isFetchingRecipes,
  recipesFetched
});