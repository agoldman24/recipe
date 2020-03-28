import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED,
  UPDATE_DISPLAY_USER_DETAIL
} from '../actions';
import {
  PROFILE_IMAGE,
  SAVED_RECIPE_IDS,
  SAVED_RECIPES,
  FOLLOWING_IDS,
  FOLLOWERS
} from '../variables/Constants';

const getUsers = state => state.users;
const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getDisplayUserDetail = state => state.displayUserDetail;

function* updateUser(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const displayUserDetail = yield select(getDisplayUserDetail);
    let res;
    switch (action.updateType) {
      case PROFILE_IMAGE:
        res = yield call(Api.post, '/updateProfileImage', {
          id: action.id,
          imageData: action.imageData
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        /* TODO: refactor displayUser object to not contain image data and then
        inside of ProfileTab pull image data from displayUserDetail instead of
        displayUser. While data is being fetched inside ProfileTab, display a
        temporary avatar containing just the initials of the display user.
        Instead of the below actions, dispatch one UPDATE_DISPLAY_USER_DETAIL
        with image data as the payload */
        yield put({ type: SET_DISPLAY_USER, user: res.data.user });
        yield put({
          type: GET_USER_DETAIL_REQUESTED,
          activeDetail: displayUserDetail.activeDetail
        });
        break;
      case SAVED_RECIPE_IDS:
        res = yield call(Api.post, '/updateSavedRecipeIds', {
          id: action.id,
          savedRecipeIds: action.keep
          ? [ ...activeUser.savedRecipeIds, action.recipeId ]
          : activeUser.savedRecipeIds.filter(id => id !== action.recipeId)
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        if (!!displayUser && activeUser.id === displayUser.id) {
          yield put({
            type: UPDATE_DISPLAY_USER_DETAIL,
            updateType: SAVED_RECIPES,
            recipe: displayUserDetail.savedRecipes[action.recipeId],
            keep: action.keep
          });
        }
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
        yield call(Api.post, '/updateFollowerIds', {
          id: action.friendId,
          followerIds: action.keep
          ? [ ...friend.followerIds, action.id ]
          : friend.followerIds.filter(id => id !== action.id)
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: FOLLOWERS,
          user: users[action.id],
          keep: action.keep
        });
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