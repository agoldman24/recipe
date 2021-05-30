import { call, put, takeLatest, select } from "redux-saga/effects";
import Api from "../api/siteUrl";
import { b64toBlob } from "../utilities/imageConverter";
import {
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  APPEND_CREATED_RECIPES,
  SET_DISPLAY_USER_DETAIL,
  NETWORK_FAILED,
} from "../actions";
import {
  RECIPE_TAB,
  CREATED_RECIPES,
  DISPLAY_USER,
} from "../variables/Constants";

const getActiveUser = (state) => state.activeUser;
const getActiveTab = (state) => state.activeTab.name;
const getDisplayUser = (state) => state.displayUser;
const getDisplayUserDetail = (state) => state.displayUserDetail;

export function* getUserDetail() {
  try {
    const activeUser = yield select(getActiveUser);
    const activeTab = yield select(getActiveTab);
    const displayUser = yield select(getDisplayUser);
    const displayUserDetail = yield select(getDisplayUserDetail);
    const activeUserIsDisplayUser =
      !!activeUser && activeUser.id === displayUser.id;
    const appendTo =
      activeTab === RECIPE_TAB || activeUserIsDisplayUser
        ? CREATED_RECIPES
        : DISPLAY_USER;
    const {
      data: { user },
    } = yield call(Api.get, "/getUserById?id=" + displayUser.id);
    const {
      profileImageId,
      followerIds,
      followingIds,
      createdRecipeIds,
      likedRecipeIds,
    } = user;

    const res0 = !!profileImageId
      ? yield call(Api.get, "/getImageById?id=" + profileImageId)
      : null;
    const res1 = !!followerIds.length
      ? yield call(Api.get, "/getUsersByIds?ids=" + followerIds)
      : { data: { users: {} } };
    const res2 = !!followingIds.length
      ? yield call(Api.get, "/getUsersByIds?ids=" + followingIds)
      : { data: { users: {} } };

    const res3 = !!createdRecipeIds.length
      ? yield call(
          Api.get,
          "/getRecipesByIds?ids=" +
            createdRecipeIds
              .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .slice(0, 20)
              .map(({ id }) => id)
        )
      : { data: { recipes: {} } };

    const res4 = !!likedRecipeIds.length
      ? yield call(
          Api.get,
          "/getRecipesByIds?ids=" +
            likedRecipeIds
              .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .slice(0, 20)
              .map(({ id }) => id)
        )
      : { data: { recipes: {} } };

    if (!!displayUserDetail && !!displayUserDetail.profileImage) {
      URL.revokeObjectURL(displayUserDetail.profileImage);
    }
    yield put({
      type: APPEND_CREATED_RECIPES,
      recipes: res3.data.recipes,
      appendTo,
    });
    yield put({
      type: SET_DISPLAY_USER_DETAIL,
      profileImage: !!profileImageId
        ? URL.createObjectURL(b64toBlob(res0.data.image.data))
        : null,
      followers: res1.data.users,
      following: res2.data.users,
      createdRecipes: res3.data.recipes,
      likedRecipes: res4.data.recipes,
      likedRecipeIds,
      createdRecipeIds,
      activeUserIsDisplayUser,
    });
    yield put({ type: GET_USER_DETAIL_SUCCEEDED });
  } catch (error) {
    yield put({ type: NETWORK_FAILED });
    console.log(error);
  }
}

function* getUserDetailSaga() {
  yield takeLatest(GET_USER_DETAIL_REQUESTED, getUserDetail);
}

export default getUserDetailSaga;
