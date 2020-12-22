import { call, put, takeEvery, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  UPDATE_TWO_USERS,
  UPDATE_DISPLAY_USER_DETAIL,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SET_ACTIVE_DETAIL,
  SET_RECIPE_CATEGORY,
  SHOW_SNACKBAR
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

const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getDisplayUserDetail = state => state.displayUserDetail;
const getCreatedRecipes = state => state.createdRecipes;
const getDetailRecipe = state => state.detailRecipe;
const getActiveTab = state => state.activeTab;
const getRecipeCategory = state => state.recipeCategory;

function* updateUser(action) {
  try {
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const displayUserDetail = yield select(getDisplayUserDetail);
    const createdRecipes = yield select(getCreatedRecipes);
    const detailRecipe = yield select(getDetailRecipe);
    const activeTab = yield select(getActiveTab);
    const recipeCategory = yield select(getRecipeCategory);
    let res, res2, user, user2, profileImageId = activeUser.profileImageId;
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
        yield put({ type: SHOW_SNACKBAR, message: "Update successful" });
        break;
      case CREATED_RECIPE_IDS:
        res = yield call(Api.post, '/updateCreatedRecipeIds', {
          id: action.id,
          recipeId: action.recipeId,
          keep: action.keep
        });
        user = res.data.user;
        yield put({ type: SET_ACTIVE_USER, user });
        if (!!displayUser && activeUser.id === displayUser.id) {
          yield put({
            type: UPDATE_DISPLAY_USER_DETAIL,
            updateType: CREATED_RECIPE_IDS,
            user
          });
          yield put({ type: SET_ACTIVE_DETAIL, detail: CREATED_RECIPES });
        } else {
          if (activeTab.name !== RECIPE_TAB)
            yield put({ type: SET_ACTIVE_TAB, newTab: { name: RECIPE_TAB }});
          yield put({
            type: SET_RECIPE_CATEGORY,
            category: recipeCategory === "By Me" ? "By Me" : "All"
          });
        }
        yield put({ type: SHOW_SNACKBAR, message: "Recipe posted successfully" });
        break;
      case LIKED_RECIPE_IDS:
        res = yield call(Api.post, '/updateLikedRecipeIds', {
          id: action.id,
          recipeId: action.recipeId,
          keep: action.keep
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
        const friendRes = yield call(Api.get, '/getUserById?id=' + action.friendId);
        const friend = friendRes.data.user;
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
        user2 = res2.data.user;
        yield put({ type: SET_ACTIVE_USER, user });
        yield put({
          type: UPDATE_DISPLAY_USER_DETAIL,
          updateType: FOLLOWERS,
          keep: action.keep,
          user, user2
        });
        yield put({ type: UPDATE_TWO_USERS, user, user2 });
        break;
      default:
        break;
    }
    yield put({ type: UPDATE_USER_SUCCEEDED });
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* updateUserSaga() {
  yield takeEvery(UPDATE_USER_REQUESTED, updateUser);
}

export default updateUserSaga;