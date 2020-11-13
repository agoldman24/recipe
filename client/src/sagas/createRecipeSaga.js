import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  CREATE_RECIPE_REQUESTED,
  UPDATE_USER_REQUESTED,
  APPEND_CREATED_RECIPES,
  ADD_CREATED_RECIPE,
  NETWORK_FAILED
} from '../actions';
import { CREATED_RECIPES, CREATED_RECIPE_IDS } from '../variables/Constants';

const getActiveUser = state => state.activeUser;
const getCreatedRecipes = state => state.createdRecipes;

function* createRecipe(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const createdRecipes = yield select(getCreatedRecipes);
    const authorName = activeUser.firstName + " " + activeUser.lastName;
    const authorId = activeUser.id;
    const { name, image, ingredients, directions } = action;
    const { data: { recipe } } = yield call(Api.post, '/createRecipe', {
      name, image, ingredients, directions, authorName, authorId
    });
    if (activeUser.createdRecipeIds.length && !Object.keys(createdRecipes).length) {
      const res = yield call(Api.get, '/getRecipesByIds?'
        + 'ids=' + activeUser.createdRecipeIds.map(obj => obj.id)
        + '&timestamps=' + activeUser.createdRecipeIds.map(obj => obj.timestamp)
      );
      yield put({
        type: APPEND_CREATED_RECIPES,
        recipes: res.data.recipes,
        appendTo: CREATED_RECIPES
      });
    }
    yield put({ type: ADD_CREATED_RECIPE, recipe });
    yield put({
      type: UPDATE_USER_REQUESTED,
      updateType: CREATED_RECIPE_IDS,
      id: activeUser.id,
      recipeId: recipe.id,
      keep: true
    });
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* createRecipeSaga() {
  yield takeLatest(CREATE_RECIPE_REQUESTED, createRecipe);
}

export default createRecipeSaga;