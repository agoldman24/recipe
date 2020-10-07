import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_RECIPE_DETAIL_REQUESTED,
  GET_RECIPE_DETAIL_SUCCEEDED,
  NETWORK_FAILED
} from '../actions';

function* getRecipeDetail(action) {
  try {
    const { data } = yield call(Api.get, '/getRecipeDetail?id=' + action.id);
    yield put({
      type: GET_RECIPE_DETAIL_SUCCEEDED,
      ingredients: data.ingredients,
      directions: data.directions
    })
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getRecipeDetailSaga() {
  yield takeLatest(GET_RECIPE_DETAIL_REQUESTED, getRecipeDetail);
}

export default getRecipeDetailSaga;