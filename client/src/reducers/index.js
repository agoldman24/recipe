import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  SET_ACTIVE_TAB,
  APPEND_DISPLAY_RECIPES,
  TOGGLE_RECIPE_DETAILS,
  EMPTY_FIELDS,
  USERNAME_EXISTS,
  SIGN_UP_REQUESTED,
  ADD_USER,
  SIGN_IN_REQUESTED,
  GET_ALL_USERS,
  GET_RECIPES_REQUESTED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  SET_DISPLAY_USER_DETAIL,
  SET_PROFILE_IMAGE,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  POPULATE_USERS,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  HYDRATION_COMPLETE
} from '../actions';

const spinnerReduce = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case SIGN_UP_REQUESTED:
    case SIGN_IN_REQUESTED:
    case GET_ALL_USERS:
    case UPDATE_USER_REQUESTED:
    case GET_RECIPES_REQUESTED:
    case GET_USER_DETAIL_REQUESTED:
      return true;
    case POPULATE_USERS:
    case UPDATE_USER_SUCCEEDED:
    case GET_USER_DETAIL_SUCCEEDED:
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
    case SET_PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.image
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
      const { friends, createdRecipes, savedRecipes, activeDetail } = action;
      return { friends, createdRecipes, savedRecipes, activeDetail };
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

export default combineReducers({
  activeTab: activeTabReduce,
  displayRecipes: displayRecipesReduce,
  detailRecipeId: detailRecipeIdReduce,
  isDetailVisible: detailVisibilityReduce,
  isSpinnerVisible: spinnerReduce,
  isHydrated: hydrationReduce,
  errorMessages: errorMessageReduce,
  snackbar: snackbarReduce,
  users: usersReduce,
  activeUser: activeUserReduce,
  displayUser: displayUserReduce,
  displayUserDetail: displayUserDetailReduce
});