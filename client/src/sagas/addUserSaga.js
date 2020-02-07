import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import { ADD_USER, SET_ACTIVE_TAB, TOGGLE_SPINNER_VISIBILITY } from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* addUser(action) {
  try {
    const { firstName, lastName, username, password } = action;
    const { data } = yield call(Api.get,
      '/user?username=' + username + "&password=" + password
    );
    if (data.users.length > 0) {
      alert("That username already exists");
    } else {
      yield put({ type: TOGGLE_SPINNER_VISIBILITY });
      yield call(Api.post, '/addUser', {
        firstName, lastName, username, password, favorites: []
      });
      yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      yield put({ type: TOGGLE_SPINNER_VISIBILITY });
    }
  } catch (err) {
    console.log(err);
  }
}

function* addUserSaga() {
  yield takeLatest(ADD_USER, addUser);
}

export default addUserSaga;