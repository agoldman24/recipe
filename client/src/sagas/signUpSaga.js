import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  SIGN_UP_REQUESTED,
  ADD_USER,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  SET_ACTIVE_TAB,
  USERNAME_EXISTS,
  NETWORK_FAILED,
  SHOW_SNACKBAR
} from '../actions';
import { PROFILE_TAB } from '../variables/Constants';

function* signUp(action) {
  try {
    const { firstName, lastName, username, password } = action;
    const { data } = yield call(Api.post, '/createUser', {
      firstName, lastName, username, password
    });
    if (!data.success) {
      yield put({ type: USERNAME_EXISTS });
    } else {
      yield put({ type: ADD_USER, user: data.user });
      yield put({ type: SET_ACTIVE_USER, user: data.user });
      yield put({ type: SET_DISPLAY_USER, user: data.user });
      yield put({ type: SET_ACTIVE_TAB, tab: PROFILE_TAB });
      yield put({ type: SHOW_SNACKBAR, message: "Sign up successful" });
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* signUpSaga() {
  yield takeLatest(SIGN_UP_REQUESTED, signUp);
}

export default signUpSaga;