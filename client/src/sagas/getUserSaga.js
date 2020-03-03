import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_USER,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  SIGN_IN_FAILED,
  NETWORK_FAILED,
  SHOW_SNACKBAR
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* getUser(action) {
  try {
    const { username, password } = action;
    const { data } = yield call(Api.get,
      '/getUser?username=' + username + "&password=" + password
    );
    if (data.success) {
      const user = { ...data.user, id: data.user._id };
      delete user._id; delete user.__v; delete user.password;
      yield put({ type: SET_ACTIVE_USER, user });
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
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
}

function* getUserSaga() {
  yield takeLatest(GET_USER, getUser);
}

export default getUserSaga;