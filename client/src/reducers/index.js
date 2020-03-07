import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  SET_ACTIVE_TAB,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  TOGGLE_RECIPE_DETAILS,
  EMPTY_FIELDS,
  USERNAME_EXISTS,
  SIGN_UP_REQUESTED,
  ADD_USER,
  SIGN_IN_REQUESTED,
  GET_ALL_USERS,
  GET_RECIPE_REQUESTED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  POPULATE_USERS,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR
} from '../actions';

const spinnerReduce = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case SIGN_UP_REQUESTED:
    case SIGN_IN_REQUESTED:
    case GET_ALL_USERS:
    case GET_RECIPE_REQUESTED:
      return true;
    case POPULATE_USERS:
    case SET_ACTIVE_USER:
    case SET_ACTIVE_RECIPE:
    case SET_ACTIVE_TAB:
    case NETWORK_FAILED:
    case SIGN_IN_FAILED:
    case USERNAME_EXISTS:
      return false;
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

const activeRecipesReduce = (state = StateTree.activeRecipes, action) => {
  switch (action.type) {
    case SET_ACTIVE_RECIPE:
      const { id, name, image, ingredients, directions, timestamp } = action;
      return {
        ...state,
        [id]: { id, name, image, ingredients, directions, timestamp }
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

const viewedRecipesReduce = (state = StateTree.viewedRecipeIds, action) => {
  switch (action.type) {
    case ADD_VIEWED_RECIPE:
      return [ ...state, action.id ];
    default:
      return state;
  }
}

const loginReduce = (state = StateTree.isLoggedIn, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return true;
    case SIGN_OUT:
      localStorage.clear();
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
      return action.user;
    default:
      return state;
  }
}

const displayUserReduce = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      return action.user;
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
  activeRecipes: activeRecipesReduce,
  viewedRecipeIds: viewedRecipesReduce,
  detailRecipeId: detailRecipeIdReduce,
  isDetailVisible: detailVisibilityReduce,
  isSpinnerVisible: spinnerReduce,
  isLoggedIn: loginReduce,
  errorMessages: errorMessageReduce,
  snackbar: snackbarReduce,
  users: usersReduce,
  activeUser: activeUserReduce,
  displayUser: displayUserReduce
});