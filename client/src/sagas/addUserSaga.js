import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  ADD_USER,
  SET_ACTIVE_TAB,
  TOGGLE_SPINNER_VISIBILITY,
  USERNAME_EXISTS,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES
} from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* addUser(action) {
  yield put({ type: CLEAR_FAILURE_MESSAGES });
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
  try {
    const { firstName, lastName, username, password } = action;
    const { data } = yield call(Api.get,
      '/username?username=' + username
    );
    if (data.users.length > 0) {
      yield put({ type: USERNAME_EXISTS });
    } else {
      yield call(Api.post, '/addUser', {
        firstName, lastName, username, password, favorites: []
      });
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
    }
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
}

function* addUserSaga() {
  yield takeLatest(ADD_USER, addUser);
}

export default addUserSaga;