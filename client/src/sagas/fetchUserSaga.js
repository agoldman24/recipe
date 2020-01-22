import { call, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import { FETCH_USER } from '../actions';

function* fetchUser(action) {
  try {
    const { username, password } = action;
    const result = yield call(Api.get,
      '/user?username=' + username + "&password=" + password
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

function* fetchUserSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export default fetchUserSaga;