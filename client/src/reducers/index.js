import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  SET_ACTIVE_TAB,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  TOGGLE_SPINNER_VISIBILITY,
  SET_ACTIVE_USER,
  LOGOUT
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
    case LOGOUT:
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

export default combineReducers({
  activeTab: activeTabReduce,
  isSpinnerVisible: spinnerReduce,
  activeRecipe: activeRecipeReduce,
  viewedRecipeIds: viewedRecipesReduce,
  isLoggedIn: loginReduce,
  activeUser: userReduce
});