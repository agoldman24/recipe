import { all } from 'redux-saga/effects';
import getRecipeSaga from './getRecipeSaga';
import addUserSaga from './addUserSaga';
import getUserSaga from './getUserSaga';
import getAllUsersSaga from './getAllUsersSaga';

export default function* rootSaga() {
  yield all([
    getRecipeSaga(),
    getUserSaga(),
    addUserSaga(),
    getAllUsersSaga()
  ])
}