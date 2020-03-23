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
  FOLLOWING_IDS
} from '../variables/Constants';

const getUsers = state => state.users;
const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getActiveDetail = state => state.displayUserDetail.activeDetail;

function* updateUser(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const activeDetail = yield select(getActiveDetail);
    let res, res2;
    switch (action.updateType) {
      case PROFILE_IMAGE:
        res = yield call(Api.post, '/updateProfileImage', {
          id: action.id,
          imageData: action.imageData
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        yield put({ type: SET_DISPLAY_USER, user: res.data.user });
        yield put({ type: GET_USER_DETAIL_REQUESTED, activeDetail });
        break;
      case SAVED_RECIPE_IDS:
        res = yield call(Api.post, '/updateSavedRecipeIds', {
          id: action.id,
          savedRecipeIds: action.keep
          ? [ ...activeUser.savedRecipeIds, action.recipeId ]
          : activeUser.savedRecipeIds.filter(id => id !== action.recipeId)
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        if (activeUser.id === displayUser.id) {
          yield put({ type: SET_DISPLAY_USER, user: res.data.user });
        }
        yield put({ type: GET_USER_DETAIL_REQUESTED, activeDetail });
        break;
      case FOLLOWING_IDS:
        const users = yield select(getUsers);
        const friend = users[action.friendId];
        res = yield call(Api.post, '/updateFollowingIds', {
          id: action.id,
          followingIds: action.keep
          ? [ ...activeUser.followingIds, action.friendId ]
          : activeUser.followingIds.filter(id => id !== action.friendId)
        });
        res2 = yield call(Api.post, '/updateFollowerIds', {
          id: action.friendId,
          followerIds: action.keep
          ? [ ...friend.followerIds, action.id ]
          : friend.followerIds.filter(id => id !== action.id)
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        yield put({ type: SET_DISPLAY_USER, user: res2.data.user });
        yield put({ type: GET_USER_DETAIL_REQUESTED, activeDetail });
        break;
      default:
        break;
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