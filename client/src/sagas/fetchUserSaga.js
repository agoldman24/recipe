import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  FETCH_USER,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  TOGGLE_SPINNER_VISIBILITY,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

const getActiveUser = state => state.activeUser;

function* fetchUser(action) {
  yield put({ type: CLEAR_FAILURE_MESSAGES });
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
  try {
    const { username, password } = action;
    const { data } = yield call(Api.get,
      '/user?username=' + username + "&password=" + password
    );
    if (data.users.length === 1) {
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      yield put({ type: SET_ACTIVE_USER, user: data.users[0] });
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      console.log(yield select(getActiveUser));
    } else {
      yield put({ type: SIGN_IN_FAILED });
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
}

function* fetchUserSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export default fetchUserSaga;