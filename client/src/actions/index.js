/* Async user actions */
export const GET_ALL_USERS = 'GET_ALL_USERS';
export const SIGN_UP_REQUESTED = 'SIGN_UP_REQUESTED';
export const SIGN_IN_REQUESTED = 'SIGN_IN_REQUESTED';
export const UPDATE_USER_REQUESTED = 'UPDATE_USER_REQUESTED';
export const UPDATE_USER_SUCCEEDED = 'UPDATE_USER_SUCCEEDED';
export const GET_USER_DETAIL_REQUESTED = 'GET_USER_DETAIL_REQUESTED';
export const GET_USER_DETAIL_SUCCEEDED = 'GET_USER_DETAIL_SUCCEEDED';
export const LOAD_RECIPE_DETAILS_START = 'LOAD_RECIPE_DETAILS_START';
export const LOAD_RECIPE_DETAILS_FINISHED = 'LOAD_RECIPE_DETAILS_FINISHED';

/* Synchronous user action */
export const POPULATE_USERS = 'POPULATE_USERS';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
export const SET_DISPLAY_USER = 'SET_DISPLAY_USER';
export const SET_DISPLAY_USER_DETAIL = 'SET_DISPLAY_USER_DETAIL';
export const SET_ACTIVE_DETAIL = 'SET_ACTIVE_DETAIL';
export const UPDATE_DISPLAY_USER_DETAIL = 'UPDATE_DISPLAY_USER_DETAIL';

/* Recipe actions */
export const GET_RECIPES_REQUESTED = 'GET_RECIPES_REQUESTED';
export const APPEND_SAMPLE_RECIPES = 'APPEND_SAMPLE_RECIPES';
export const APPEND_SAVED_RECIPES = 'APPEND_SAVED_RECIPES';
export const TOGGLE_RECIPE_DETAILS = 'TOGGLE_RECIPE_DETAILS';
export const TOGGLE_DETAIL_EDIT_MODE = 'TOGGLE_DETAIL_EDIT_MODE';
export const TOGGLE_DETAIL_ADD_ROW_MODE = 'TOGGLE_DETAIL_ADD_ROW_MODE';

/* Tab actions */
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

/* Sign in/out actions */
export const SIGN_IN_FAILED = 'SIGN_IN_FAILED';
export const SIGN_OUT = 'SIGN_OUT';

/* Error message actions */
export const NETWORK_FAILED = 'NETWORK_FAILED';
export const CLEAR_ERROR_MESSAGES = 'CLEAR_ERROR_MESSAGES';
export const USERNAME_EXISTS = 'USERNAME_EXISTS';
export const EMPTY_FIELDS = 'EMPTY_FIELDS';

/* UI toggling actions */
export const SHOW_SNACKBAR = 'SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR';
export const TOGGLE_DRAWER_MENU = 'TOGGLE_DRAWER_MENU';
export const TOGGLE_PROFILE_EDITOR = 'TOGGLE_PROFILE_EDITOR';

/* Loading spinner actions */
export const START_FILE_UPLOAD = 'START_FILE_UPLOAD';
export const HYDRATION_COMPLETE = "HYDRATION_COMPLETE";

/* Profile Editor actions */
export const UPDATE_PROFILE_EDITOR = 'UPDATE_PROFILE_EDITOR';