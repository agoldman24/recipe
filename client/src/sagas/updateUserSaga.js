import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  UPDATE_USER,
  UPDATE_DISPLAY_USER_DETAIL,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SET_ACTIVE_DETAIL,
  SET_RECIPE_CATEGORY
} from '../actions';
import {
  PROFILE,
  RECIPE_TAB,
  CREATED_RECIPE_IDS,
  CREATED_RECIPES,
  LIKED_RECIPE_IDS,
  LIKED_RECIPES,
  FOLLOWING_IDS,
  FOLLOWERS
} from '../variables/Constants';

const getUsers = state => state.users;
const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getDisplayUserDetail = state => state.displayUserDetail;
const getCreatedRecipes = state => state.createdRecipes;
const getDetailRecipe = state => state.detailRecipe;

function* updateUser(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const displayUserDetail = yield select(getDisplayUserDetail);
    const createdRecipes = yield select(getCreatedRecipes);
    const detailRecipe = yield select(getDetailRecipe);
    let res, res2, user, profileImageId = activeUser.profileImageId;
    switch (action.updateType) {
      case PROFILE:
        const { imageData, firstName, lastName, username } = action;
        if (!!imageData) {
          if (!profileImageId) {
            res = yield call(Api.post, '/createImage', {
              data: imageData
            });
            profileImageId = res.data.image.id;
          }
          else {
            yield call(Api.post, '/updateImage', {
              id: profileImageId,
              data: imageData
            });
          }
        }
        res2 = yield call(Api.post, '/updateProfile', {
          id: activeUser.id,
          profileImageId, firstName, lastName, username
        });
        user = res2.data.user;
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: PROFILE, 
          imageData, user
        });
        break;
      case CREATED_RECIPE_IDS:
        const recipeIds = action.keep
        ? [
            ...activeUser.createdRecipeIds,
            {
              id: action.recipeId,
              timestamp: Date.now()
            }
          ]
        : activeUser.createdRecipeIds.filter(obj => obj.id !== action.recipeId)
        res = yield call(Api.post, '/updateCreatedRecipeIds', {
          id: action.id,
          createdRecipeIds: recipeIds
        });
        user = res.data.user;
        yield put({ type: SET_ACTIVE_USER, user });
        if (!!displayUser && activeUser.id === displayUser.id) {
          yield put({
            type: UPDATE_DISPLAY_USER_DETAIL,
            updateType: CREATED_RECIPE_IDS,
            recipeIds,
            user
          });
          yield put({ type: SET_ACTIVE_DETAIL, detail: CREATED_RECIPES });
        } else {
          yield put({ type: SET_ACTIVE_TAB, newTab: { name: RECIPE_TAB }});
          yield put({ type: SET_RECIPE_CATEGORY, category: "By Me" });
        }
        break;
      case LIKED_RECIPE_IDS:
        res = yield call(Api.post, '/updateLikedRecipeIds', {
          id: action.id,
          likedRecipeIds: action.keep
          ? [
              ...activeUser.likedRecipeIds,
              {
                id: action.recipeId,
                timestamp: Date.now()
              }
            ]
          : activeUser.likedRecipeIds.filter(obj => obj.id !== action.recipeId)
        });
        user = res.data.user;
        yield put({ type: SET_ACTIVE_USER, user });
        if (!!displayUser && activeUser.id === displayUser.id) {
          yield put({
            type: UPDATE_DISPLAY_USER_DETAIL,
            updateType: LIKED_RECIPES,
            recipe: displayUserDetail.activeDetail === CREATED_RECIPES
              ? createdRecipes[action.recipeId]
              : action.keep ? detailRecipe : displayUserDetail.likedRecipes[action.recipeId],
            keep: action.keep,
            user
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
        user = res.data.user;
        yield put({ type: SET_ACTIVE_USER, user: res.data.user });
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: FOLLOWERS,
          keep: action.keep,
          user
        });
        yield put({ type: UPDATE_USER, user });
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