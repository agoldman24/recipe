import { call, put, takeLatest, select } from 'redux-saga/effects';
import Api from '../api/recipeUrl';
import {
  GET_RECIPE_REQUESTED,
  SET_ACTIVE_RECIPE,
  ADD_VIEWED_RECIPE,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES
} from '../actions';

const getViewedRecipeIds = state => state.viewedRecipeIds;

function* getRecipe() {
  yield put({ type: CLEAR_ERROR_MESSAGES });
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
          item: data['strIngredient' + (i + 1)],
          quantity: data['strMeasure' + (i + 1)]
        };
      }).filter(ingredient => !!ingredient.item),
      timestamp: new Date()
    });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getRecipeSaga() {
  yield takeLatest(GET_RECIPE_REQUESTED, getRecipe);
}

export default getRecipeSaga;