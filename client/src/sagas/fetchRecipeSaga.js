import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/recipeUrl';
import {
  FETCH_RECIPE_REQUESTED,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  TOGGLE_SPINNER_VISIBILITY,
  NETWORK_FAILED,
  CLEAR_FAILURE_MESSAGES
} from '../actions';

const getViewedRecipeIds = state => state.viewedRecipeIds;

function* fetchRecipe() {
  yield put({ type: CLEAR_FAILURE_MESSAGES });
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });
  try {
    const viewedRecipeIds = yield select(getViewedRecipeIds);
    let result, data;
    for(;;) {
      result = yield call(Api.get);
      data = result.data.meals[0];
      if (!viewedRecipeIds.includes(data.idMeal)) {
        break;
      }
    }
    yield put({ type: ADD_VIEWED_RECIPE, id: data.idMeal });
    yield put({
      type: SET_ACTIVE_RECIPE,
      id: data.idMeal,
      name: data.strMeal,
      image: data.strMealThumb,
      directions: data.strInstructions,
      ingredients: Array(20).fill().map((val, i) => {
        return {
          name: data['strIngredient' + (i + 1)],
          quantity: data['strMeasure' + (i + 1)]
        };
      })
    });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
  yield put({ type: TOGGLE_SPINNER_VISIBILITY });

}

function* fetchRecipeSaga() {
  yield takeLatest(FETCH_RECIPE_REQUESTED, fetchRecipe);
}

export default fetchRecipeSaga;