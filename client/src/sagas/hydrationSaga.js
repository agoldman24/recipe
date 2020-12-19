import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import { getUserDetail } from './getUserDetailSaga';
import {
  NETWORK_FAILED,
  INIT_HYDRATION,
  POPULATE_USERS,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER,
  SET_RECIPE_CATEGORY,
  COMPLETE_HYDRATION
} from '../actions';
import {
  PROFILE_TAB,
  WELCOME_TAB
} from '../variables/Constants';

const isDefined = v => !!v && v !== "null" && v !== "undefined";

function* runHydration() {
  try {
    const { data: { users } } = yield call(Api.get, '/getAllUsers');
    yield put({ type: POPULATE_USERS, users });
    const activeUserId = localStorage.getItem("activeUserId");
    const activeTab = localStorage.getItem("activeTab");
    const category = localStorage.getItem("recipeCategory");
    if (isDefined(activeUserId)) {
      const res = yield call(Api.get, '/getUserById?id=' + activeUserId);
      yield put({ type: SET_ACTIVE_USER, user: res.data.user });
    }
    if (isDefined(category)) {
      yield put({ type: SET_RECIPE_CATEGORY, category });
    }
    if (isDefined(activeTab)) {
      if (activeTab === PROFILE_TAB) {
        yield put({
          type: SET_DISPLAY_USER,
          user: users[localStorage.getItem("displayUserId")]
        });
        yield* getUserDetail();
      }
      yield put({
        type: SET_ACTIVE_TAB, 
        currentTab: null,
        newTab: { name: activeTab }
      });
    } else {
      yield put({
        type: SET_ACTIVE_TAB, 
        currentTab: null,
        newTab: { name: WELCOME_TAB }
      });
    }
    yield put({ type: COMPLETE_HYDRATION })
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* hydrationSaga() {
  return yield takeLatest(INIT_HYDRATION, runHydration);
}

export default hydrationSaga;