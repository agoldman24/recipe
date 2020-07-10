import { combineReducers } from 'redux';
import { b64toBlob } from '../utilities/imageConverter';
import StateTree from '../store/stateTree';
import {
  GET_ALL_USERS,
  SIGN_UP_REQUESTED,
  SIGN_IN_REQUESTED,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCEEDED,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCEEDED,
  POPULATE_USERS,
  ADD_USER,
  UPDATE_USER,
  SET_ACTIVE_USER,
  SET_DISPLAY_USER,
  SET_DISPLAY_USER_DETAIL,
  SET_ACTIVE_DETAIL,
  UPDATE_DISPLAY_USER_DETAIL,
  GET_RECIPES_REQUESTED,
  APPEND_SAMPLE_RECIPES,
  APPEND_SAVED_RECIPES,
  TOGGLE_RECIPE_DETAILS,
  SET_ACTIVE_TAB,
  HYDRATION_COMPLETE,
  SIGN_IN_FAILED,
  SIGN_OUT,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES,
  USERNAME_EXISTS,
  EMPTY_FIELDS,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  TOGGLE_DRAWER_MENU,
  TOGGLE_PROFILE_EDITOR,
  UPDATE_PROFILE_EDITOR,
  START_FILE_UPLOAD,
} from '../actions';
import {
  PROFILE_TAB,
  SAVED_RECIPES,
  FOLLOWERS,
  PROFILE,
  PUSH,
} from '../variables/Constants';

const isSpinnerVisible = (state = StateTree.isSpinnerVisible, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
    case SIGN_UP_REQUESTED:
    case SIGN_IN_REQUESTED:
    case GET_USER_DETAIL_REQUESTED:
    case UPDATE_USER_REQUESTED:
    case GET_RECIPES_REQUESTED:
    case START_FILE_UPLOAD:
      return true;
    case POPULATE_USERS:
    case GET_USER_DETAIL_SUCCEEDED:
    case UPDATE_USER_SUCCEEDED:
    case APPEND_SAMPLE_RECIPES:
    case APPEND_SAVED_RECIPES:
    case NETWORK_FAILED:
    case SIGN_IN_FAILED:
    case USERNAME_EXISTS:
    case SHOW_SNACKBAR:
    case UPDATE_PROFILE_EDITOR:
      return false;
    default:
      return state;
  }
}

const isHydrated = (state = StateTree.isHydrated, action) => {
  switch (action.type) {
    case HYDRATION_COMPLETE:
      return true;
    default:
      return state;
  }
}

const activeTab = (state = StateTree.activeTab, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      document.getElementById('root').scrollTo(0, 0);
      document.getElementById('container').scrollTo(0, 0);
      localStorage.setItem("activeTab", action.newTab.name);
      return action.newTab;
    default:
      return state;
  }
}

const tabHistory = (state = StateTree.tabHistory, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return !!action.currentTab
        ? action.operation === PUSH
          ? [ ...state, action.currentTab ]
          : state.filter((tab, index) => index < state.length - 1)
        : []
    default:
      return state;
  }
}

const sampleRecipes = (state = StateTree.sampleRecipes, action) => {
  switch (action.type) {
    case APPEND_SAMPLE_RECIPES:
      return {
        ...state,
        ...action.recipes
      }
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

const isDetailVisible = (state = StateTree.isDetailVisible, action) => {
  switch (action.type) {
    case TOGGLE_RECIPE_DETAILS:
      return !state;
    default:
      return state;
  }
}

const detailRecipeId = (state = StateTree.detailRecipeId, action) => {
  switch (action.type) {
    case TOGGLE_RECIPE_DETAILS:
      return !!action.id ? action.id : state;
    default:
      return state;
  }
}

const isDrawerMenuVisible = (state = StateTree.isDrawerMenuVisible, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER_MENU:
      return !state;
    default:
      return state;
  }
}

const users = (state = StateTree.users, action) => {
  switch (action.type) {
    case POPULATE_USERS:
      return action.users;
    case ADD_USER:
    case UPDATE_USER:
    case SET_ACTIVE_USER:
    case SET_DISPLAY_USER:
    case UPDATE_DISPLAY_USER_DETAIL:
      console.log("action:", action);
      return {
        ...state,
        [action.user.id]: action.user
      };
    default:
      return state;
  }
}

const activeUser = (state = null, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      localStorage.setItem("activeUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case PROFILE:
          return {
            ...state,
            profileImageId: action.user.profileImageId,
            firstName: action.user.firstName,
            lastName: action.user.lastName,
            username: action.user.username
          }
        default:
          return state;
      }
    case SIGN_OUT:
      localStorage.clear();
      return null;
    default:
      return state;
  }
}

const displayUser = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      localStorage.setItem("displayUserId", action.user.id);
      return action.user;
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case SAVED_RECIPES:
          return {
            ...state,
            savedRecipeIds: action.keep
            ? [
                ...state.savedRecipeIds,
                {
                  id: action.recipe.id,
                  timestamp: Date.now()
                }
              ]
            : state.savedRecipeIds.filter(obj => obj.id !== action.recipe.id)
          }
        case FOLLOWERS:
          return {
            ...state,
            followerIds: action.keep
            ? [ ...state.followerIds, action.user.id ]
            : state.followerIds.filter(id => id !== action.user.id)
          }
        case PROFILE:
          return {
            ...state,
            profileImageId: action.user.profileImageId,
            firstName: action.user.firstName,
            lastName: action.user.lastName,
            username: action.user.username
          }
        default:
          return state;
      }
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        return null;
      } else {
        return state;
      }
    default:
      return state;
  }
}

const displayUserDetail = (state = null, action) => {
  switch (action.type) {
    case SET_DISPLAY_USER:
      return null;
    case SET_DISPLAY_USER_DETAIL:
      localStorage.setItem("activeDetail", action.activeDetail);
      const {
        profileImage, followers, following, createdRecipes, savedRecipes, activeDetail
      } = action;
      return {
        profileImage, followers, following, createdRecipes, savedRecipes, activeDetail
      };
    case SET_ACTIVE_DETAIL:
      localStorage.setItem("activeDetail", action.detail);
      return {
        ...state,
        activeDetail: action.detail
      };
    case APPEND_SAVED_RECIPES:
      return {
        ...state,
        savedRecipes: {
          ...state.savedRecipes,
          ...action.recipes
        }
      }
    case UPDATE_DISPLAY_USER_DETAIL:
      switch (action.updateType) {
        case SAVED_RECIPES:
          return {
            ...state,
            savedRecipes: action.keep
              ? { ...state.savedRecipes, [action.recipe.id]: action.recipe }
              : Object.keys(state.savedRecipes).filter(id => id !== action.recipe.id)
                .reduce((accum, id) => {
                  accum[id] = state.savedRecipes[id];
                  return accum;
                }, {})
          }
        case FOLLOWERS:
          return {
            ...state,
            followers: action.keep
              ? { ...state.followers, [action.user.id]: action.user }
              : Object.keys(state.followers).filter(id => id !== action.user.id)
                .reduce((accum, id) => {
                  accum[id] = state.followers[id];
                  return accum;
                }, {}),
            following: Object.keys(state.following).includes(action.user.id)
              ? {
                  ...state.following,
                  [action.user.id]: action.user
                }
              : state.following
          }
        case PROFILE:
          return {
            ...state,
            profileImage: !!action.imageData
              ? URL.createObjectURL(b64toBlob(action.imageData))
              : state.profileImage
          }
        default:
          throw new Error('Invalid update type');
      }
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        if (!!state && !!state.profileImage) {
          URL.revokeObjectURL(state.profileImage);
        }
        return null;
      }
      return state;
    default:
      return state;
  }
}

const errorMessages = (state = StateTree.errorMessages, action) => {
  switch (action.type) {
    case SIGN_IN_FAILED:
      return { ...state, loginFailed: true }
    case NETWORK_FAILED:
      return { ...state, networkFailed: true }
    case USERNAME_EXISTS:
      return { ...state, usernameExists: true }
    case EMPTY_FIELDS:
      return { ...state, emptyFields: true }
    case CLEAR_ERROR_MESSAGES:
      return {
        loginFailed: false,
        networkFailed: false,
        usernameExists: false,
        emptyFields: false
      }
    default:
      return state
  }
}

export const snackbar = (state = StateTree.snackbar, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        isVisible: true,
        message: action.message
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        isVisible: false
      };
    default:
      return state;
  }
}

const profileEditor = (state = StateTree.profileEditor, action) => {
  switch (action.type) {
    case TOGGLE_PROFILE_EDITOR:
      return !!action.firstName
        ? {
            firstName: action.firstName,
            lastName: action.lastName,
            username: action.username,
            profileImage: action.profileImage
          }
        : null;
    case UPDATE_PROFILE_EDITOR:
      if (!!action.imageData) {
        return {
          ...state,
          profileImage: URL.createObjectURL(b64toBlob(action.imageData))
        }
      }
      else if (!!action.firstName) {
        return {
          ...state,
          firstName: action.firstName
        }
      }
      else if (!!action.lastName) {
        return {
          ...state,
          lastName: action.lastName
        }
      }
      else if (!!action.username) {
        return {
          ...state,
          username: action.username
        }
      }
      return state;
    default:
      return state;
  }
}

const usersFetched = (state = StateTree.usersFetched, action) => {
  switch (action.type) {
    case POPULATE_USERS:
      return true;
    default:
      return state;
  }
}

const allRecipesFetched = (state = StateTree.allRecipesFetched, action) => {
  switch (action.type) {
    case APPEND_SAMPLE_RECIPES:
      return {
        ...state,
        samples: Object.keys(action.recipes).length < 9
      };
    case APPEND_SAVED_RECIPES:
      return {
        ...state,
        saved: Object.keys(action.recipes).length < 9
      };
    case SET_DISPLAY_USER_DETAIL:
      return {
        ...state,
        created: Object.keys(action.createdRecipes).length < 9,
        saved: Object.keys(action.savedRecipes).length < 9
      };
    case SET_ACTIVE_TAB:
      if (action.newTab.name !== PROFILE_TAB) {
        return {
          ...state,
          creatd: false,
          saved: false
        };
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  activeTab,
  tabHistory,
  sampleRecipes,
  detailRecipeId,
  isDetailVisible,
  isDrawerMenuVisible,
  isSpinnerVisible,
  profileEditor,
  usersFetched,
  isHydrated,
  errorMessages,
  snackbar,
  users,
  activeUser,
  displayUser,
  displayUserDetail,
  allRecipesFetched
});