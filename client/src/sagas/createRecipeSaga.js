import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  CREATE_RECIPE_REQUESTED,
  UPDATE_USER_REQUESTED,
  ADD_CREATED_RECIPE,
  TOGGLE_RECIPE_CREATE_MODE,
  SET_RECIPE_CATEGORY,
  SET_ACTIVE_TAB,
  NETWORK_FAILED
} from '../actions';
import { CREATED_RECIPE_IDS, RECIPE_TAB } from '../variables/Constants';

const getActiveUser = state => state.activeUser;
const getActiveTab = state => state.activeTab;

function* createRecipe(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const activeTab = yield select(getActiveTab);
    const authorName = activeUser.firstName + " " + activeUser.lastName;
    const authorId = activeUser.id;
    const { name, image, ingredients, directions } = action;
    const { data: { recipe } } = yield call(Api.post, '/createRecipe', {
      name, image, ingredients, directions, authorName, authorId
    });
    yield put({
      type: UPDATE_USER_REQUESTED,
      updateType: CREATED_RECIPE_IDS,
      id: activeUser.id,
      recipeId: recipe.id,
      keep: true
    });
    if (activeTab.name !== RECIPE_TAB)
      yield put({ type: SET_ACTIVE_TAB, newTab: { name: RECIPE_TAB }});
    yield put({ type: TOGGLE_RECIPE_CREATE_MODE });
    yield put({ type: SET_RECIPE_CATEGORY, category: "By Me" });
    yield put({ type: ADD_CREATED_RECIPE, recipe });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* createRecipeSaga() {
  yield takeLatest(CREATE_RECIPE_REQUESTED, createRecipe);
}

export default createRecipeSaga;