import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  ADD_USER,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  USERNAME_EXISTS,
  NETWORK_FAILED,
  SHOW_SNACKBAR
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* addUser(action) {
  try {
    const { firstName, lastName, username, password } = action;
    const { data } = yield call(Api.post, '/addUser', {
      firstName, lastName, username, password, favorites: []
    });
    if (!data.success) {
      yield put({ type: USERNAME_EXISTS });
    } else {
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      yield put({ type: SET_ACTIVE_USER, user: data.user });
      yield put({ type: SHOW_SNACKBAR, message: "Sign up successful" }); 
      localStorage.setItem("username", data.username);
      localStorage.setItem("password", data.password);
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* addUserSaga() {
  yield takeLatest(ADD_USER, addUser);
}

export default addUserSaga;