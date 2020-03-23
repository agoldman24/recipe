import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  SET_DISPLAY_USER_DETAIL,
  NETWORK_FAILED
} from '../actions';

const getDisplayUser = state => state.displayUser;

function* getUserDetail(action) {
  try {
    const displayUser = yield select(getDisplayUser);
    const res1 = !!displayUser.followerIds.length
      ? yield call(Api.get, '/getUsersByIds?ids=' + displayUser.followerIds)
      : { data: { users: {} } };
    const res2 = !!displayUser.followingIds.length
      ? yield call(Api.get, '/getUsersByIds?ids=' + displayUser.followingIds)
      : { data: { users: {} } };
    const res3 = !!displayUser.createdRecipeIds.length
      ? yield call(Api.get, '/getRecipesByIds?ids=' + displayUser.createdRecipeIds)
      : { data: { recipes: {} } };
    const res4 = !!displayUser.savedRecipeIds.length
      ? yield call(Api.get, '/getRecipesByIds?ids=' + displayUser.savedRecipeIds)
      : { data: { recipes: {} } };;
    yield put({
      type: SET_DISPLAY_USER_DETAIL,
      followers: res1.data.users,
      following: res2.data.users,
      createdRecipes: res3.data.recipes,
      savedRecipes: res4.data.recipes,
      activeDetail: action.activeDetail
    });
    yield put({ type: GET_USER_DETAIL_SUCCEEDED })
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getUserDetailSaga() {
  yield takeLatest(GET_USER_DETAIL_REQUESTED, getUserDetail);
}

export default getUserDetailSaga;