import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  SIGN_IN_REQUESTED,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  NETWORK_FAILED,
  SHOW_SNACKBAR
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* signIn(action) {
  try {
    const { username, password, id } = action;
    const { data } = !!username
      ? yield call(Api.get, '/getUser?username=' + username + "&password=" + password)
      : yield call(Api.get, '/getUserById?id=' + id);
    if (data.success) {
      yield put({ type: SET_ACTIVE_USER, user: data.user });
      const activeUserId = localStorage.getItem("activeUserId");
      if (!activeUserId || activeUserId === "null") {
        yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
        yield put({ type: SHOW_SNACKBAR, message: "Sign in successful" });
      }
    } else {
      yield put({ type: SIGN_IN_FAILED });
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* signInSaga() {
  yield takeLatest(SIGN_IN_REQUESTED, signIn);
}

export default signInSaga;