import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  FETCH_USER,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  TOGGLE_SPINNER_VISIBILITY,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES,
  SHOW_SNACKBAR
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* fetchUser(action) {
  yield put({ type: CLEAR_FAILURE_MESSAGES });
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
  try {
    const { username, password } = action;
    const { data } = yield call(Api.get,
      '/user?username=' + username + "&password=" + password
    );
    if (data.success) {
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      yield put({ type: SET_ACTIVE_USER, user: data.user });
      if (!localStorage.getItem("username")) {
        yield put({ type: SHOW_SNACKBAR, message: "Sign in successful" });
        localStorage.setItem("username", data.username);
        localStorage.setItem("password", data.password);
      }
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