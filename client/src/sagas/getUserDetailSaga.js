import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  SET_DISPLAY_USER_DETAIL,
  NETWORK_FAILED
} from '../actions';
import { b64toBlob } from '../utilities/imageConverter';

const getDisplayUser = state => state.displayUser;
const getDisplayUserDetail = state => state.displayUserDetail;

function* getUserDetail(action) {
  try {
    const displayUser = yield select(getDisplayUser);
    const res0 = !!displayUser.profileImageId
      ? yield call(Api.get, '/getImageById?id=' + displayUser.profileImageId)
      : null;
    const res1 = !!displayUser.followerIds.length
      ? yield call(Api.get, '/getUsersByIds?ids=' + displayUser.followerIds)
      : { data: { users: {} } };
    const res2 = !!displayUser.followingIds.length
      ? yield call(Api.get, '/getUsersByIds?ids=' + displayUser.followingIds)
      : { data: { users: {} } };
    const res3 = !!displayUser.createdRecipeIds.length
      ? yield call(Api.get, '/getRecipesByIds?'
          + 'ids=' + displayUser.createdRecipeIds.map(obj => obj.id)
          + '&timestamps=' + displayUser.createdRecipeIds.map(obj => obj.timestamp)
        )
      : { data: { recipes: {} } };
    const res4 = !!displayUser.likedRecipeIds.length
      ? yield call(Api.get, '/getRecipesByIds?'
          + 'ids=' + displayUser.likedRecipeIds.map(obj => obj.id)
          + '&timestamps=' + displayUser.likedRecipeIds.map(obj => obj.timestamp)
        )
      : { data: { recipes: {} } };
    const displayUserDetail = yield select(getDisplayUserDetail);
    if (!!displayUserDetail && !!displayUserDetail.profileImage) {
      URL.revokeObjectURL(displayUserDetail.profileImage);
    }
    yield put({
      type: SET_DISPLAY_USER_DETAIL,
      profileImage: !!displayUser.profileImageId
        ? URL.createObjectURL(b64toBlob(res0.data.image.data))
        : null,
      followers: res1.data.users,
      following: res2.data.users,
      createdRecipes: res3.data.recipes,
      likedRecipes: res4.data.recipes,
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