import { call, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import { ADD_USER } from '../actions';

function* addUser(action) {
  try {
    const { firstName, lastName, username, password } = action;
    yield call(Api.post, '/addUser', {
      firstName, lastName, username, password
    });
  } catch (err) {
    console.log(err);
  }
}

function* addUserSaga() {
  yield takeLatest(ADD_USER, addUser);
}

export default addUserSaga;