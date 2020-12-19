import { call, put, select, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  DELETE_USER_REQUESTED, DELETE_USER_SUCCEEDED, NETWORK_FAILED,
  POPULATE_USERS, SET_ACTIVE_TAB, SIGN_OUT, SHOW_SNACKBAR
} from '../actions';
import { WELCOME_TAB } from '../variables/Constants';

const getActiveUser = state => state.activeUser;

function* deleteUser() {
  try {
    const user = yield select(getActiveUser);
    const deletedUserId = user.id;
    yield call(Api.post, '/deleteUser', { user });
    const { data: { users } } = yield call(Api.get, '/getAllUsers');
    yield put({ type: POPULATE_USERS, users });
    yield put({
      type: SET_ACTIVE_TAB,
      currentTab: null,
      newTab: { name: WELCOME_TAB }
    });
    yield put({ type: SIGN_OUT });
    yield put({ type: SHOW_SNACKBAR, message: "Your account was deleted" });
    yield put({ type: DELETE_USER_SUCCEEDED, deletedUserId });
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* deleteUserSaga() {
  yield takeLatest(DELETE_USER_REQUESTED, deleteUser);
}

export default deleteUserSaga;