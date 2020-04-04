import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';

import {
  GET_RECIPES_REQUESTED,
  APPEND_DISPLAY_RECIPES,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES
} from '../actions';

const getDisplayRecipes = state => state.displayRecipes;

function* getRecipes() {
  yield put({ type: CLEAR_ERROR_MESSAGES });
  try {
    const displayRecipes = yield select(getDisplayRecipes);
    const { data } = !!Object.keys(displayRecipes).length
      ? yield call(Api.get, '/getSamples?ids=' + Object.keys(displayRecipes))
      : yield call(Api.get, '/getSamples');
    yield put({
      type: APPEND_DISPLAY_RECIPES,
      recipes: data.recipes
    });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getRecipesSaga() {
  yield takeLatest(GET_RECIPES_REQUESTED, getRecipes);
}

export default getRecipesSaga;