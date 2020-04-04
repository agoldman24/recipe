import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  GET_ALL_USERS,
  SIGN_UP_REQUESTED,
  SIGN_IN_REQUESTED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  POPULATE_USERS,
  ADD_USER,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  SET_DISPLAY_USER_DETAIL,
  SET_ACTIVE_DETAIL,
  UPDATE_DISPLAY_USER_DETAIL,
  GET_RECIPES_REQUESTED,
  APPEND_DISPLAY_RECIPES,
  TOGGLE_RECIPE_DETAILS,
  SET_ACTIVE_TAB,
  HYDRATION_COMPLETE,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES,
  USERNAME_EXISTS,
  EMPTY_FIELDS,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR
} from '../actions';
import {
  PROFILE_TAB,
  SAVED_RECIPES,
  FOLLOWERS,
  PROFILE_IMAGE,
} from '../variables/Constants';

const spinnerReduce = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
    case SIGN_UP_REQUESTED:
    case SIGN_IN_REQUESTED:
    case GET_USER_DETAIL_REQUESTED:
    case UPDATE_USER_REQUESTED:
    case GET_RECIPES_REQUESTED:
      return true;
    case POPULATE_USERS:
    case GET_USER_DETAIL_SUCCEEDED:
    case UPDATE_USER_SUCCEEDED:
    case APPEND_DISPLAY_RECIPES:
    case NETWORK_FAILED:
    case SIGN_IN_FAILED:
    case USERNAME_EXISTS:
    case SHOW_SNACKBAR:
      return false;
    default:
      return state;
  }
}

const hydrationReduce = (state = StateTree.isHydrated, action) => {
  switch (action.type) {
    case HYDRATION_COMPLETE:
      return true;
    default:
      return state;
  }
}

const activeTabReduce = (state = StateTree.activeTab, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      document.getElementById('root').scrollTo(0, 0);
      localStorage.setItem("activeTab", action.tab);
      return action.tab;
    default:
      return state;
  }
}

const displayRecipesReduce = (state = StateTree.displayRecipes, action) => {
  switch (action.type) {
    case APPEND_DISPLAY_RECIPES:
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

const detailVisibilityReduce = (state = StateTree.isDetailVisible, action) => {
  switch (action.type) {
    case TOGGLE_RECIPE_DETAILS:
      return !state;
    default:
      return state;
  }
}

const detailRecipeIdReduce = (state = StateTree.detailRecipeId, action) => {
  switch (action.type) {
    case TOGGLE_RECIPE_DETAILS:
      return !!action.id ? action.id : state;
    default:
      return state;
  }
}

const allRecipesFetchedReduce = (state = StateTree.allRecipesFetched, action) => {
  switch (action.type) {
    case APPEND_DISPLAY_RECIPES:
      if (action.recipes.length < 10) {
        return true;
      }
      return false;
    default:
      return state;
  }
}

const usersReduce = (state = StateTree.users, action) => {
  switch (action.type) {
    case POPULATE_USERS:
      return action.users;
    case ADD_USER:
    case SET_ACTIVE_USER:
    case SET_DISPLAY_USER:
      return {
        ...state,
        [action.user.id]: action.user
      };
    default:
      return state;
  }
}

const activeUserReduce = (state = null, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      localStorage.setItem("activeUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case PROFILE_IMAGE:
          return {
            ...state,
            profileImageId: action.profileImageId
          }
        default:
          return state;
      }
    case SIGN_OUT:
      localStorage.clear();
      return null;
    default:
      return state;
  }
}

const displayUserReduce = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      localStorage.setItem("displayUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case SAVED_RECIPES:
          return {
            ...state,
            savedRecipeIds: action.keep
            ? [ ...state.savedRecipeIds, action.recipe.id ]
            : state.savedRecipeIds.filter(id => id !== action.recipe.id)
          }
        case FOLLOWERS:
          return {
            ...state,
            followerIds: action.keep
            ? [ ...state.followerIds, action.user.id ]
            : state.followerIds.filter(id => id !== action.user.id)
          }
        case PROFILE_IMAGE:
          return {
            ...state,
            profileImageId: action.profileImageId
          }
        default:
          return state;
      }
    case SET_ACTIVE_TAB:
      if (action.tab !== PROFILE_TAB) {
        return null;
      } else {
        return state;
      }
    default:
      return state;
  }
}

const displayUserDetailReduce = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      return null;
    case SET_DISPLAY_USER_DETAIL:
      localStorage.setItem("activeDetail", action.activeDetail);
      const {
        profileImage, followers, following, createdRecipes, savedRecipes, activeDetail
      } = action;
      return {
        profileImage, followers, following, createdRecipes, savedRecipes, activeDetail
      };
    case SET_ACTIVE_DETAIL:
      localStorage.setItem("activeDetail", action.detail);
      return {
        ...state,
        activeDetail: action.detail
      };
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case SAVED_RECIPES:
          return {
            ...state,
            savedRecipes: action.keep
            ? { ...state.savedRecipes, [action.recipe.id]: action.recipe }
            : Object.keys(state.savedRecipes).filter(id => id !== action.recipe.id)
              .reduce((accum, id) => {
                accum[id] = state.savedRecipes[id];
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
              }, {})
          }
        case PROFILE_IMAGE:
          return {
            ...state,
            profileImage: action.imageUrl
          }
        default:
          throw new Error('Invalid update type');
      }
    case SET_ACTIVE_TAB:
      if (action.tab !== PROFILE_TAB) {
        if (!!state && !!state.profileImage) {
          URL.revokeObjectURL(state.profileImage);
        }
        return null;
      } else {
        return state;
      }
    default:
      return state;
  }
}

const errorMessageReduce = (state = StateTree.errorMessages, action) => {
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

export const snackbarReduce = (state = StateTree.snackbar, action) => {
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

const usersFetchedReduce = (state = false, action) => {
  switch (action.type) {
    case POPULATE_USERS:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  activeTab: activeTabReduce,
  displayRecipes: displayRecipesReduce,
  detailRecipeId: detailRecipeIdReduce,
  allRecipesFetched: allRecipesFetchedReduce,
  isDetailVisible: detailVisibilityReduce,
  isSpinnerVisible: spinnerReduce,
  usersFetched: usersFetchedReduce,
  isHydrated: hydrationReduce,
  errorMessages: errorMessageReduce,
  snackbar: snackbarReduce,
  users: usersReduce,
  activeUser: activeUserReduce,
  displayUser: displayUserReduce,
  displayUserDetail: displayUserDetailReduce
});