import { all } from 'redux-saga/effects';
import getRecipesSaga from './getRecipesSaga';
import getRecipeDetailSaga from './getRecipeDetailSaga';
import createRecipeSaga from './createRecipeSaga';
import signUpSaga from './signUpSaga';
import signInSaga from './signInSaga';
import updateUserSaga from './updateUserSaga';
import hydrationSaga from './hydrationSaga';
import getUserDetailSaga from './getUserDetailSaga';
import getIconsSaga from './getIconsSaga';

export default function* rootSaga() {
  yield all([
    getRecipesSaga(),
    getRecipeDetailSaga(),
    createRecipeSaga(),
    signInSaga(),
    signUpSaga(),
    updateUserSaga(),
    hydrationSaga(),
    getUserDetailSaga(),
    getIconsSaga()
  ])
}