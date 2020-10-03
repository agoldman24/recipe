import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';
import {
  GET_ICONS_REQUESTED,
  GET_ICONS_FINISHED
} from '../actions';

function* getIcons({ searchWord }) {
  try {
    const wordArray = searchWord.split(' ');
    const queryString = wordArray.reduce((accum, current, index) => {
      accum += current;
      if (index < wordArray.length - 1) {
        accum += '%20';
      }
      return accum;
    }, "");
    const { data } = yield call(Api.get, '/getIcons?searchWord=' + queryString);
    yield put({ type: GET_ICONS_FINISHED, icons: !!data.icons ? data.icons : [] });
  } catch (err) {
    yield put({ type: GET_ICONS_FINISHED, icons: [] });
  }
}

function* getIconsSaga() {
  return yield takeLatest(GET_ICONS_REQUESTED, getIcons);
}

export default getIconsSaga;