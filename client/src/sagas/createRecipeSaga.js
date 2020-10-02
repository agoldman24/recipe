import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  CREATE_RECIPE_REQUESTED,
  UPDATE_USER_REQUESTED,
  ADD_CREATED_RECIPE,
  TOGGLE_RECIPE_CREATE_MODE,
  NETWORK_FAILED
} from '../actions';
import { CREATED_RECIPE_IDS } from '../variables/Constants';

const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getActiveTab = state => state.activeTab;

function* createRecipe(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const authorName = activeUser.firstName + " " + activeUser.lastName;
    const authorId = activeUser.id;
    const { name, image, ingredients, directions } = action;
    const { data: { recipe } } = yield call(Api.post, '/createRecipe', {
      name, image, ingredients, directions, authorName, authorId
    });
    yield put({ type: ADD_CREATED_RECIPE, recipe });
    yield put({ type: TOGGLE_RECIPE_CREATE_MODE });
    yield put({
      type: UPDATE_USER_REQUESTED,
      updateType: CREATED_RECIPE_IDS,
      id: activeUser.id,
      recipeId: recipe.id,
      keep: true
    });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* createRecipeSaga() {
  yield takeLatest(CREATE_RECIPE_REQUESTED, createRecipe);
}

export default createRecipeSaga;