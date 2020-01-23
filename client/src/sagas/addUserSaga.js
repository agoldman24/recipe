import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import { ADD_USER, SET_ACTIVE_TAB } from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

function* addUser(action) {
  try {
    const { firstName, lastName, username, password } = action;
    yield call(Api.post, '/addUser', {
      firstName, lastName, username, password, favorites: []
    });
    yield put({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
  } catch (err) {
    console.log(err);
  }
}

function* addUserSaga() {
  yield takeLatest(ADD_USER, addUser);
}

export default addUserSaga;