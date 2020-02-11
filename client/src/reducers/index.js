import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  SET_ACTIVE_TAB,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  TOGGLE_RECIPE_DETAILS,
  TOGGLE_SPINNER_VISIBILITY,
  HIDE_SPINNER,
  EMPTY_FIELDS,
  USERNAME_EXISTS,
  SET_ACTIVE_USER,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR
} from '../actions';

const activeTabReduce = (state = StateTree.activeTab, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return action.tab;
    default:
      return state;
  }
}

const spinnerReduce = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case TOGGLE_SPINNER_VISIBILITY:
      return !state;
    case HIDE_SPINNER:
      return false;
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

const loginFailureReduce = (state = StateTree.loginFailed, action) => {
  switch (action.type) {
    case SIGN_IN_FAILED:
      return true;
    case CLEAR_FAILURE_MESSAGES:
      return false;
    default:
      return state;
  }
}

const networkFailureReduce = (state = StateTree.networkFailed, action) => {
  switch (action.type) {
    case NETWORK_FAILED:
      return true;
    case CLEAR_FAILURE_MESSAGES:
      return false;
    default:
      return state;
  }
}

const userReduce = (state = StateTree.activeUser, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return action.user;
    default:
      return state;
  }
}

const usernameExistsReduce = (state = StateTree.usernameExists, action) => {
  switch (action.type) {
    case USERNAME_EXISTS:
      return true;
    case CLEAR_FAILURE_MESSAGES:
      return false;
    default:
      return state;
  }
}

const emptyFieldsReduce = (state = StateTree.emptyFields, action) => {
  switch (action.type) {
    case EMPTY_FIELDS:
      return true;
    case CLEAR_FAILURE_MESSAGES:
      return false;
    default:
      return state;
  }
}

export const snackbarReduce = (state = StateTree.isSnackbarVisible, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return true;
    case HIDE_SNACKBAR:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  activeTab: activeTabReduce,
  activeUser: userReduce,
  activeRecipes: activeRecipesReduce,
  viewedRecipeIds: viewedRecipesReduce,
  isDetailVisible: detailVisibilityReduce,
  detailRecipeId: detailRecipeIdReduce,
  isSpinnerVisible: spinnerReduce,
  emptyFields: emptyFieldsReduce,
  usernameExists: usernameExistsReduce,
  isLoggedIn: loginReduce,
  loginFailed: loginFailureReduce,
  networkFailed: networkFailureReduce,
  isSnackbarVisible: snackbarReduce
});