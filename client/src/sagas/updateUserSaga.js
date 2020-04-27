import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  UPDATE_USER,
  SET_ACTIVE_USER,
  UPDATE_DISPLAY_USER_DETAIL
} from '../actions';
import {
  PROFILE,
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
    let res, res2, user, profileImageId = activeUser.profileImageId;
    switch (action.updateType) {
      case PROFILE:
        const { imageData, firstName, lastName } = action;
        if (!profileImageId) {
          res = yield call(Api.post, '/createImage', {
            data: imageData
          });
          profileImageId = res.data.image.id;
          res2 = yield call(Api.post, '/updateProfile', {
            id: activeUser.id,
            profileImageId
          });
          user = res2.data.user;
        } else {
          yield call(Api.post, '/updateImage', {
            id: profileImageId,
            data: imageData
          });
          user = activeUser;
        }
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: PROFILE, 
          data: imageData,
          profileImageId, user
        });
        break;
      case SAVED_RECIPE_IDS:
        res = yield call(Api.post, '/updateSavedRecipeIds', {
          id: action.id,
          savedRecipeIds: action.keep
          ? [
              ...activeUser.savedRecipeIds,
              {
                id: action.recipeId,
                timestamp: Date.now()
              }
            ]
          : activeUser.savedRecipeIds.filter(obj => obj.id !== action.recipeId)
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
        res2 = yield call(Api.post, '/updateFollowerIds', {
          id: action.friendId,
          followerIds: action.keep
          ? [ ...friend.followerIds, action.id ]
          : friend.followerIds.filter(id => id !== action.id)
        });
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: FOLLOWERS,
          user: res.data.user,
          keep: action.keep
        });
        yield put({ type: UPDATE_USER, user: res2.data.user });
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