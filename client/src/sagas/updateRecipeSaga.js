import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_RECIPE_REQUESTED,
  UPDATE_DETAIL_RECIPE
} from '../actions';

const getDetailRecipe = state => state.detailRecipe;

function* updateRecipe(action) {
  try {
    const detailRecipe = yield select(getDetailRecipe);
    const { name, image, ingredients, directions } = action;
    yield call(Api.post, '/updateRecipe', {
      id: detailRecipe.id,
      name, image, ingredients, directions
    });
    yield put({
      type: UPDATE_DETAIL_RECIPE,
      recipe: { ...detailRecipe, name, image }
    })
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* updateRecipeSaga() {
  yield takeEvery(UPDATE_RECIPE_REQUESTED, updateRecipe);
}

export default updateRecipeSaga;