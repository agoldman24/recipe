import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_RECIPES_REQUESTED,
  APPEND_SAMPLE_RECIPES,
  APPEND_FRIEND_RECIPES,
  APPEND_CREATED_RECIPES,
  APPEND_LIKED_RECIPES,
  NETWORK_FAILED
} from '../actions';
import {
  SAMPLE_RECIPES,
  FRIEND_RECIPES,
  CREATED_RECIPES,
  LIKED_RECIPES,
  DISPLAY_USER,
  RECIPE_TAB
} from '../variables/Constants';

const getSampleRecipes = state => state.sampleRecipes;
const getActiveTab = state => state.activeTab.name;
const getActiveUser = state => state.activeUser;
const getDisplayUser = state => state.displayUser;

function* getRecipes(action) {
  try {
    let res;
    switch (action.requestType) {
      case SAMPLE_RECIPES:
        const sampleRecipes = yield select(getSampleRecipes);
        res = !!Object.keys(sampleRecipes).length
          ? yield call(Api.get, '/getSamples?ids=' + Object.keys(sampleRecipes))
          : yield call(Api.get, '/getSamples');
        yield put({
          type: APPEND_SAMPLE_RECIPES,
          recipes: res.data.recipes
        });
        break;
      case FRIEND_RECIPES:
      case CREATED_RECIPES:
      case LIKED_RECIPES:
        const activeTab = yield select(getActiveTab);
        const activeUser = yield select(getActiveUser);
        const displayUser = yield select(getDisplayUser);
        const activeUserIsDisplayUser = !!activeUser && !!displayUser && activeUser.id === displayUser.id;
        const appendTo = activeTab === RECIPE_TAB || activeUserIsDisplayUser
          ? CREATED_RECIPES
          : DISPLAY_USER;
        res = !!action.ids.length
          ? yield call(Api.get, '/getRecipesByIds?'
              + 'ids=' + action.ids.map(obj => obj.id)
              + '&timestamps=' + action.ids.map(obj => obj.timestamp)
            )
          : { data: { recipes: {} } }
        yield put({
          type: action.requestType === FRIEND_RECIPES
            ? APPEND_FRIEND_RECIPES
            : action.requestType === CREATED_RECIPES
              ? APPEND_CREATED_RECIPES
              : APPEND_LIKED_RECIPES,
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