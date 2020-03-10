import { all } from 'redux-saga/effects';
import getRecipeSaga from './getRecipeSaga';
import signUpSaga from './signUpSaga';
import signInSaga from './signInSaga';
import updateUserSaga from './updateUserSaga';
import getAllUsersSaga from './getAllUsersSaga';
import getUserDetailSaga from './getUserDetailSaga';

export default function* rootSaga() {
  yield all([
    getRecipeSaga(),
    getAllUsersSaga(),
    signInSaga(),
    signUpSaga(),
    updateUserSaga()
    //getUserDetailSaga()
  ])
}