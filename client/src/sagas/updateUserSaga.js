import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER
} from '../actions';
import {
  PROFILE_IMAGE,
  SAVED_RECIPE_IDS
} from '../variables/Constants';

const getActiveUser = state => state.activeUser

function* updateUser(action) {
  try {
    switch (action.updateType) {
      case PROFILE_IMAGE:
        yield call(Api.post, '/updateProfileImage', {
          id: action.id,
          imageData: action.imageData
        });
        break;
      case SAVED_RECIPE_IDS:
        const user = yield select(getActiveUser);
        yield call(Api.post, '/updateSavedRecipeIds', {
          id: action.id,
          savedRecipeIds: action.keep
          ? [
              ...user.savedRecipeIds,
              action.recipeId
            ]
          : user.savedRecipeIds.filter(id => id !== action.recipeId)
        });
        break;
      default:
        break;
    }
    const { data } = yield call(Api.get, '/getUserById?id=' + action.id);
    yield put({ type: SET_ACTIVE_USER, user: data.user });
    if (action.updateType === PROFILE_IMAGE) {
      yield put({ type: SET_DISPLAY_USER, user: data.user });
    }
    yield put({ type: UPDATE_USER_SUCCEEDED });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* updateUserSaga() {
  yield takeEvery(UPDATE_USER_REQUESTED, updateUser);
}

export default updateUserSaga;