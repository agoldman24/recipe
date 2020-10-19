import { all } from 'redux-saga/effects';
import getRecipesSaga from './getRecipesSaga';
import createRecipeSaga from './createRecipeSaga';
import signUpSaga from './signUpSaga';
import signInSaga from './signInSaga';
import updateUserSaga from './updateUserSaga';
import hydrationSaga from './hydrationSaga';
import getUserDetailSaga from './getUserDetailSaga';

export default function* rootSaga() {
  yield all([
    getRecipesSaga(),
    createRecipeSaga(),
    signInSaga(),
    signUpSaga(),
    updateUserSaga(),
    hydrationSaga(),
    getUserDetailSaga()
  ])
}