import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  SET_ACTIVE_TAB,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  TOGGLE_SPINNER_VISIBILITY,
  HIDE_SPINNER,
  EMPTY_FIELDS,
  USERNAME_EXISTS,
  SET_ACTIVE_USER,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES
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

const activeRecipeReduce = (state = StateTree.activeRecipe, action) => {
  switch (action.type) {
    case SET_ACTIVE_RECIPE:
      return {
        id: action.id,
        name: action.name,
        image: action.image,
        ingredients: action.ingredients,
        directions: action.directions
      }
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

export default combineReducers({
  activeTab: activeTabReduce,
  activeUser: userReduce,
  activeRecipe: activeRecipeReduce,
  viewedRecipeIds: viewedRecipesReduce,
  isSpinnerVisible: spinnerReduce,
  emptyFields: emptyFieldsReduce,
  usernameExists: usernameExistsReduce,
  isLoggedIn: loginReduce,
  loginFailed: loginFailureReduce,
  networkFailed: networkFailureReduce
});