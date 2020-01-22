import { all } from 'redux-saga/effects';
import fetchRecipeSaga from './fetchRecipeSaga';
import addUserSaga from './addUserSaga';
import fetchUserSaga from './fetchUserSaga';

export default function* rootSaga() {
  yield all([
    fetchRecipeSaga(),
    addUserSaga(),
    fetchUserSaga()
  ])
}