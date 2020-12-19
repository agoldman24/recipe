import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_RECIPES_REQUESTED,
  APPEND_ALL_RECIPES,
  APPEND_FRIEND_RECIPES,
  APPEND_CREATED_RECIPES,
  APPEND_LIKED_RECIPES,
  NETWORK_FAILED,
  UPDATE_USERS
} from '../actions';
import {
  ALL_RECIPES,
  FRIEND_RECIPES,
  CREATED_RECIPES,
  LIKED_RECIPES,
  DISPLAY_USER,
  RECIPE_TAB
} from '../variables/Constants';

const getOldestFetchedTimestamp = state => state.oldestFetchedTimestamp;
const getActiveTab = state => state.activeTab.name;
const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;
const getCreatedRecipes = state => state.createdRecipes;
const getFriendRecipes = state => state.friendRecipes;
const getAllUsers = state => state.users;

function* getRecipes(action) {
  try {
    const oldestFetchedTimestamp = yield select(getOldestFetchedTimestamp);
    const activeTab = yield select(getActiveTab);
    const activeUser = yield select(getActiveUser);
    const displayUser = yield select(getDisplayUser);
    const createdRecipes = yield select(getCreatedRecipes);
    const friendRecipes = yield select(getFriendRecipes);
    const allUsers = yield select(getAllUsers);
    const activeUserIsDisplayUser = !!activeUser && !!displayUser && activeUser.id === displayUser.id;
    const appendTo = activeTab === RECIPE_TAB || activeUserIsDisplayUser ? CREATED_RECIPES : DISPLAY_USER
    const ids = [], timestamps = [];
    let res;
    switch (action.requestType) {
      case ALL_RECIPES:
        res = yield call(Api.get, '/getRecipesByTime?timestamp=' + oldestFetchedTimestamp)
        yield put({
          type: APPEND_ALL_RECIPES,
          recipes: res.data.recipes
        });
        break;
      case FRIEND_RECIPES:
        const { data: { users } } = yield call(Api.get, '/getUsersByIds?ids=' + activeUser.followingIds);
        const updatedUsers = {
          ...allUsers,
          ...users
        }
        yield put({ type: UPDATE_USERS, users: updatedUsers });
        activeUser.followingIds.forEach(friendId => {
          updatedUsers[friendId].createdRecipeIds
            .filter(obj => !Object.keys(friendRecipes).includes(obj.id))
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
            .forEach(obj => {
              ids.push(obj.id);
              timestamps.push(obj.timestamp);
            });
        });
        res = yield call(Api.get, '/getRecipesByIds?'
          + 'ids=' + ids
          + '&timestamps=' + timestamps
        );
        yield put({
          type: APPEND_FRIEND_RECIPES,
          recipes: res.data.recipes
        });
        break;
      case CREATED_RECIPES:
        activeUser.createdRecipeIds
          .filter(obj => !Object.keys(createdRecipes).includes(obj.id))
          .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
          .forEach(obj => {
            ids.push(obj.id);
            timestamps.push(obj.timestamp);
          });
        res = yield call(Api.get, '/getRecipesByIds?'
          + 'ids=' + ids
          + '&timestamps=' + timestamps
        );
        yield put({
          type: APPEND_CREATED_RECIPES,
          recipes: res.data.recipes,
          appendTo
        });
        break;
      case LIKED_RECIPES:
        res = yield call(Api.get, '/getRecipesByIds?'
          + 'ids=' + action.ids.map(obj => obj.id)
          + '&timestamps=' + action.ids.map(obj => obj.timestamp));
        yield put({
          type: APPEND_LIKED_RECIPES,
          recipes: res.data.recipes,
          appendTo
        });
        break;
      default:
        throw new Error('Unrecognized request type');
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