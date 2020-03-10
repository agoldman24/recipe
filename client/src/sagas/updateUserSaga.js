import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  NETWORK_FAILED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER
} from '../actions';

function* updateUser(action) {
  try {
    yield call(Api.post, '/updateUser', {
      id: action.id,
      imageData: action.imageData
    });
    const { data } = yield call(Api.get, '/getUserById?id=' + action.id);
    yield put({ type: SET_ACTIVE_USER, user: data.user });
    yield put({ type: SET_DISPLAY_USER, user: data.user });
    yield put({ type: UPDATE_USER_SUCCEEDED });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* updateUserSaga() {
  yield takeLatest(UPDATE_USER_REQUESTED, updateUser);
}

export default updateUserSaga;