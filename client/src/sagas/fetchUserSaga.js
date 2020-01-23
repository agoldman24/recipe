import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  FETCH_USER,
  SET_ACTIVE_USER,
  SET_ACTIVE_TAB,
  LOGIN_FAILED
} from '../actions';
import { SIGN_IN_TAB, RECIPE_TAB } from '../variables/Constants';

const getActiveUser = state => state.activeUser;

function* fetchUser(action) {
  try {
    const { username, password } = action;
    const { data } = yield call(Api.get,
      '/user?username=' + username + "&password=" + password
    );
    if (data.users.length === 1) {
      yield put({ type: SET_ACTIVE_USER, user: data.users[0] });
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      console.log(yield select(getActiveUser));
    } else {
      alert("LOGIN FAILED");
      yield put({ type: LOGIN_FAILED });
      yield put({ type: SET_ACTIVE_TAB, tab: SIGN_IN_TAB });
    }
  } catch (err) {
    console.log(err);
  }
}

function* fetchUserSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export default fetchUserSaga;