import { call, put, select, takeLatest } from "redux-saga/effects";
import Api from "../api/siteUrl";
import {
  GET_RECIPES_REQUESTED,
  APPEND_ALL_RECIPES,
  APPEND_FRIEND_RECIPES,
  APPEND_CREATED_RECIPES,
  APPEND_LIKED_RECIPES,
  REPLACE_ALL_RECIPES,
  REPLACE_FRIEND_RECIPES,
  REPLACE_CREATED_RECIPES,
  NETWORK_FAILED,
  UPDATE_USERS,
} from "../actions";
import {
  ALL_RECIPES,
  FRIEND_RECIPES,
  CREATED_RECIPES,
  LIKED_RECIPES,
  DISPLAY_USER,
  RECIPE_TAB,
} from "../variables/Constants";

const getOldestFetchedRecipeTimestamp = (state) =>
  state.oldestFetchedRecipeTimestamp;
const getRefreshNeeded = (state) => state.refreshNeeded;
const getActiveTab = (state) => state.activeTab.name;
const getActiveUser = (state) => state.activeUser;
const getDisplayUser = (state) => state.displayUser;
const getDisplayUserDetail = (state) => state.displayUserDetail;
const getCreatedRecipes = (state) => state.createdRecipes;
const getFriendRecipes = (state) => state.friendRecipes;
const getAllUsers = (state) => state.users;

function* getRecipes(action) {
  try {
    const oldestFetchedRecipeTimestamp = yield select(
      getOldestFetchedRecipeTimestamp
    );
    const refreshNeeded = yield select(getRefreshNeeded);
    const activeTab = yield select(getActiveTab);
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const displayUserDetail = yield select(getDisplayUserDetail);
    const createdRecipes = yield select(getCreatedRecipes);
    const friendRecipes = yield select(getFriendRecipes);
    const allUsers = yield select(getAllUsers);
    const activeUserIsDisplayUser =
      !!activeUser && !!displayUser && activeUser.id === displayUser.id;
    const appendTo =
      activeTab === RECIPE_TAB || activeUserIsDisplayUser
        ? CREATED_RECIPES
        : DISPLAY_USER;
    const timestamp = !!action.timestamp
      ? action.timestamp
      : oldestFetchedRecipeTimestamp;
    let ids, res;
    switch (action.requestType) {
      case ALL_RECIPES:
        if (!!action.keyword.length) {
          res = yield call(
            Api.get,
            "/getRecipesByKeyword?keyword=" +
              action.keyword +
              "&timestamp=" +
              timestamp
          );
          yield put({
            type: !!action.timestamp ? REPLACE_ALL_RECIPES : APPEND_ALL_RECIPES,
            recipes: res.data.recipes,
          });
        } else {
          res = yield call(Api.get, "/getRecipesByTime?timestamp=" + timestamp);
          yield put({
            type: refreshNeeded ? REPLACE_ALL_RECIPES : APPEND_ALL_RECIPES,
            recipes: res.data.recipes,
          });
        }
        break;
      case FRIEND_RECIPES:
        const {
          data: { users },
        } = yield call(
          Api.get,
          "/getUsersByIds?ids=" + activeUser.followingIds
        );
        const updatedUsers = { ...allUsers, ...users };
        yield put({ type: UPDATE_USERS, users: updatedUsers });
        if (!!action.keyword.length) {
          ids = activeUser.followingIds
            .reduce(
              (accum, friendId) => [
                ...accum,
                ...updatedUsers[friendId].createdRecipeIds,
              ],
              []
            )
            .map(({ id }) => id);
          if (!!ids.length) {
            res = yield call(
              Api.get,
              "/getRecipesByIdsAndKeyword?ids=" +
                ids +
                "&keyword=" +
                action.keyword
            );
            yield put({
              type: REPLACE_FRIEND_RECIPES,
              recipes: res.data.recipes,
            });
          } else {
            yield put({
              type: REPLACE_FRIEND_RECIPES,
              recipes: {},
            });
          }
        } else {
          ids = activeUser.followingIds
            .reduce(
              (accum, friendId) => [
                ...accum,
                ...updatedUsers[friendId].createdRecipeIds.filter(
                  ({ id }) => !Object.keys(friendRecipes).includes(id)
                ),
              ],
              []
            )
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
            .slice(0, 20)
            .map(({ id }) => id);
          if (!!ids.length) {
            res = yield call(Api.get, "/getRecipesByIds?ids=" + ids);
            yield put({
              type: APPEND_FRIEND_RECIPES,
              recipes: res.data.recipes,
            });
          } else {
            yield put({
              type: APPEND_FRIEND_RECIPES,
              recipes: {},
            });
          }
        }
        break;
      case CREATED_RECIPES:
        let recipes, recipeIds;
        if (appendTo === CREATED_RECIPES) {
          recipes = createdRecipes;
          recipeIds = activeUser.createdRecipeIds;
        } else {
          recipes = displayUserDetail.createdRecipes;
          recipeIds = displayUserDetail.createdRecipeIds;
        }
        if (!!action.keyword.length) {
          if (!!recipeIds.length) {
            res = yield call(
              Api.get,
              "/getRecipesByIdsAndKeyword?ids=" +
                recipeIds.map(({ id }) => id) +
                "&keyword=" +
                action.keyword
            );
            yield put({
              type: REPLACE_CREATED_RECIPES,
              recipes: res.data.recipes,
              appendTo,
            });
          } else {
            yield put({
              type: REPLACE_CREATED_RECIPES,
              recipes: {},
              appendTo,
            });
          }
        } else {
          ids = recipeIds
            .filter(({ id }) => !Object.keys(recipes).includes(id))
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
            .slice(0, 20)
            .map(({ id }) => id);
          if (!!ids.length) {
            res = yield call(Api.get, "/getRecipesByIds?ids=" + ids);
            yield put({
              type: APPEND_CREATED_RECIPES,
              recipes: res.data.recipes,
              appendTo,
            });
          } else {
            yield put({
              type: APPEND_CREATED_RECIPES,
              recipes: {},
              appendTo,
            });
          }
        }
        break;
      case LIKED_RECIPES:
        const { likedRecipeIds, likedRecipes } = displayUserDetail;
        ids = likedRecipeIds
          .filter(({ id }) => !Object.keys(likedRecipes).includes(id))
          .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
          .slice(0, 20)
          .map(({ id }) => id);
        if (!!ids.length) {
          res = yield call(Api.get, "/getRecipesByIds?ids=" + ids);
          yield put({
            type: APPEND_LIKED_RECIPES,
            recipes: res.data.recipes,
            appendTo,
          });
        } else {
          yield put({
            type: APPEND_LIKED_RECIPES,
            recipes: {},
            appendTo,
          });
        }
        break;
      default:
        throw new Error("Un3recognized request type");
    }
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* getRecipesSaga() {
  yield takeLatest(GET_RECIPES_REQUESTED, getRecipes);
}

export default getRecipesSaga;
