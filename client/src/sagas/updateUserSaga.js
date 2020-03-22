import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED
} from '../actions';
import {
  PROFILE_IMAGE,
  SAVED_RECIPE_IDS,
  FRIEND_IDS
} from '../variables/Constants';

const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getActiveDetail = state => state.displayUserDetail.activeDetail;

function* updateUser(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    switch (action.updateType) {
      case PROFILE_IMAGE:
        yield call(Api.post, '/updateProfileImage', {
          id: action.id,
          imageData: action.imageData
        });
        break;
      case SAVED_RECIPE_IDS:
        yield call(Api.post, '/updateSavedRecipeIds', {
          id: action.id,
          savedRecipeIds: action.keep
          ? [ ...activeUser.savedRecipeIds, action.recipeId ]
          : activeUser.savedRecipeIds.filter(id => id !== action.recipeId)
        });
        break;
      case FRIEND_IDS:
        yield call(Api.post, '/updateFriendIds', {
          id: action.id,
          friendIds: action.keep
          ? [ ...activeUser.friendIds, action.friendId ]
          : activeUser.friendIds.filter(id => id !== action.friendId)
        });
        break;
      default:
        break;
    }
    const { data } = yield call(Api.get, '/getUserById?id=' + action.id);
    yield put({ type: UPDATE_USER_SUCCEEDED });
    yield put({ type: SET_ACTIVE_USER, user: data.user });
    if (activeUser.id === displayUser.id) {
      const activeDetail = yield select(getActiveDetail);
      yield put({ type: SET_DISPLAY_USER, user: data.user });
      yield put({ type: GET_USER_DETAIL_REQUESTED, activeDetail });
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* updateUserSaga() {
  yield takeEvery(UPDATE_USER_REQUESTED, updateUser);
}

export default updateUserSaga;