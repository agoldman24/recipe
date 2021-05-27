import { call, put, takeLatest } from "redux-saga/effects";
import Api from "../api/siteUrl";
import {
  SIGN_IN_REQUESTED,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  NETWORK_FAILED,
  SHOW_SNACKBAR,
} from "../actions";
import { RECIPE_TAB } from "../variables/Constants";

function* signIn(action) {
  try {
    const { username, password } = action;
    const { data } = yield call(
      Api.get,
      "/getUser?username=" + username + "&password=" + password
    );
    if (data.success) {
      yield put({ type: SET_ACTIVE_USER, user: data.user });
      yield put({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: RECIPE_TAB },
      });
      yield put({ type: SHOW_SNACKBAR, message: "Login successful" });
    } else {
      yield put({ type: SIGN_IN_FAILED });
    }
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* signInSaga() {
  yield takeLatest(SIGN_IN_REQUESTED, signIn);
}

export default signInSaga;
