import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  GET_ALL_USERS,
  POPULATE_USERS
} from '../actions';

function* getAllUsers() {
  try {
    const { data } = yield call(Api.get, '/getAllUsers');
    yield put({ type: POPULATE_USERS, users: data.users });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getAllUsersSaga() {
  return yield takeLatest(GET_ALL_USERS, getAllUsers);
}

export default getAllUsersSaga;