import { combineReducers } from 'redux';
import StateTree from '../store/stateTree';
import {
  FETCH_RECIPE_SUCCEEDED,
  FETCH_RECIPE_FAILED,
  UPDATE_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE
} from '../actions';

const fetchRecipeSuccessReduce = (state = StateTree.fetchRecipeSuccess, action) => {
  switch(action.type) {
    case FETCH_RECIPE_SUCCEEDED:
      return true;
    case FETCH_RECIPE_FAILED:
      return false;
    default:
      return state;
  }
}

const activeRecipeReduce = (state = StateTree.activeRecipe, action) => {
  switch(action.type) {
    case UPDATE_ACTIVE_RECIPE:
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
  switch(action.type) {
    case ADD_VIEWED_RECIPE:
      return [ ...state, action.id ];
    default:
      return state;
  }
}

export default combineReducers({
  fetchRecipeSuccess: fetchRecipeSuccessReduce,
  activeRecipe: activeRecipeReduce,
  viewedRecipeIds: viewedRecipesReduce
});