import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_RECIPE_REQUESTED,
  UPDATE_DETAIL_RECIPE,
  DELETE_RECIPE_REQUESTED,
  DELETE_RECIPE,
  SHOW_SNACKBAR
} from '../actions';

const getDetailRecipe = state => state.detailRecipe;
const getActiveUser = state => state.activeUser;

function* updateRecipe(action) {
  try {
    const detailRecipe = yield select(getDetailRecipe);
    const { name, serves, image, ingredients, directions } = action;
    yield call(Api.post, '/updateRecipe', {
      id: detailRecipe.id,
      name, serves, image, ingredients, directions
    });
    yield put({
      type: UPDATE_DETAIL_RECIPE,
      recipe: { ...detailRecipe, name, image }
    });
    yield put({ type: SHOW_SNACKBAR, message: "Update successful"})
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* deleteRecipe(action) {
  try {
    const detailRecipe = yield select(getDetailRecipe);
    const activeUser = yield select(getActiveUser);
    const id = !!action.id ? action.id : detailRecipe.id;
    const authorId = activeUser.id;
    const { data: { likedByIds } } = yield call(Api.post, '/deleteRecipe', { id });
    yield put({ type: DELETE_RECIPE, id, authorId, likedByIds });
    yield put({ type: SHOW_SNACKBAR, message: "Recipe deleted" })
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* updateRecipeSaga() {
  yield takeEvery(UPDATE_RECIPE_REQUESTED, updateRecipe);
  yield takeEvery(DELETE_RECIPE_REQUESTED, deleteRecipe);
}

export default updateRecipeSaga;