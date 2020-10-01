import { all } from 'redux-saga/effects';
import getRecipesSaga from './getRecipesSaga';
import createRecipeSaga from './createRecipeSaga';
import signUpSaga from './signUpSaga';
import signInSaga from './signInSaga';
import updateUserSaga from './updateUserSaga';
import getAllUsersSaga from './getAllUsersSaga';
import getUserDetailSaga from './getUserDetailSaga';
import getIconsSaga from './getIconsSaga';

export default function* rootSaga() {
  yield all([
    getRecipesSaga(),
    createRecipeSaga(),
    signInSaga(),
    signUpSaga(),
    updateUserSaga(),
    getAllUsersSaga(),
    getUserDetailSaga(),
    getIconsSaga()
  ])
}