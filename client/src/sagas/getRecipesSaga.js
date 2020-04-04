import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_RECIPES_REQUESTED,
  APPEND_SAMPLE_RECIPES,
  APPEND_SAVED_RECIPES,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES
} from '../actions';
import { SAMPLES, SAVED_RECIPES } from '../variables/Constants';

const getSampleRecipes = state => state.sampleRecipes;

function* getRecipes(action) {
  yield put({ type: CLEAR_ERROR_MESSAGES });
  try {
    let res;
    switch (action.requestType) {
      case SAMPLES:
        const sampleRecipes = yield select(getSampleRecipes);
        res = !!Object.keys(sampleRecipes).length
          ? yield call(Api.get, '/getSamples?ids=' + Object.keys(sampleRecipes))
          : yield call(Api.get, '/getSamples');
        yield put({
          type: APPEND_SAMPLE_RECIPES,
          recipes: res.data.recipes
        });
        break;
      case SAVED_RECIPES:
        res = !!action.ids.length
          ? yield call(Api.get, '/getRecipesByIds?ids=' + action.ids)
          : { data: { recipes: {} } }
        yield put({
          type: APPEND_SAVED_RECIPES,
          recipes: res.data.recipes
        });
        break;
      default:
        throw new Error('Unrecognized request type');
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getRecipesSaga() {
  yield takeLatest(GET_RECIPES_REQUESTED, getRecipes);
}

export default getRecipesSaga;