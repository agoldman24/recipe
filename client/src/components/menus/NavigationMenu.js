import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import {
  SET_ACTIVE_TAB, CLEAR_ERROR_MESSAGES, SIGN_OUT, SHOW_SNACKBAR,
  SET_DISPLAY_USER, GET_USER_DETAIL_REQUESTED
} from '../../actions';
import {
  CREATE_RECIPE, RECIPE_TAB, USERS_TAB, PROFILE_TAB, WELCOME_TAB
} from '../../variables/Constants';
import { defaultTheme } from '../../styles';

const NavigationMenu = props => {

  const tabStyle = tab => ({
    minWidth: '40px',
    minHeight: '40px',
    marginLeft: tab === CREATE_RECIPE || tab === WELCOME_TAB
      ? 'auto'
      : 'initial',
    color: tab === props.activeTab.name && props.highlightedTab
      ? defaultTheme.palette.primary.main
      : 'white'
  });

  const onChangeTab = (event, newValue) => {
    props.clearErrorMessages();
    switch (newValue) {
      case CREATE_RECIPE:
        props.toggleCreateMode();
        break;
      case SIGN_OUT:
        props.signOut();
        break;
      default:
        props.setActiveTab(newValue, props.activeUser);
        break;
    }
  }

  return (
    <ThemeProvider theme={createMuiTheme(defaultTheme)}>
      {props.isLoggedIn
        ? <Tabs
            value={props.highlightedTab ? props.activeTab.name : false}
            indicatorColor="primary"
            textColor="primary"
            onChange={onChangeTab}
            style={{ minHeight: '40px' }}
          >
            <Tab
              icon={<AddBoxOutlinedIcon/>}
              value={CREATE_RECIPE}
              style={tabStyle(CREATE_RECIPE, props.activeTab.name)}
            />
            <Tab
              icon={<MenuBookSharpIcon/>}
              value={RECIPE_TAB}
              style={tabStyle(RECIPE_TAB, props.activeTab.name)}
            />
            <Tab
              icon={<PeopleAltIcon/>}
              value={USERS_TAB}
              style={tabStyle(USERS_TAB, props.activeTab.name)}
            />
            <Tab
              icon={<AccountCircleIcon/>}
              value={PROFILE_TAB}
              style={tabStyle(PROFILE_TAB, props.activeTab.name)}
            />
            <Tab
              icon={<ExitToAppIcon/>}
              value={SIGN_OUT}
              style={tabStyle(SIGN_OUT, props.activeTab.name)}
            />
          </Tabs>
        : <Tabs
            value={props.highlightedTab ? props.activeTab.name : false}
            indicatorColor="primary"
            textColor="primary"
            onChange={onChangeTab}
            style={{ minHeight: '40px' }}
          >
            <Tab
              icon={<HomeIcon/>}
              value={WELCOME_TAB}
              style={tabStyle(WELCOME_TAB, props.activeTab.name)}
            />
          </Tabs>
      }
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    highlightedTab: state.activeTab.name === USERS_TAB
      || state.activeTab.name === RECIPE_TAB
      || state.activeTab.name === WELCOME_TAB
      || (state.activeTab.name === PROFILE_TAB &&
        state.activeUser.id === state.displayUser.id),
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearErrorMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
    setActiveTab: (name, user) => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name }
      });
      if (name === PROFILE_TAB) {
        dispatch({ type: SET_DISPLAY_USER, user });
        dispatch({ type: GET_USER_DETAIL_REQUESTED });
      }
    },
    signOut: () => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: WELCOME_TAB }
      });
      dispatch({ type: SIGN_OUT });
      dispatch({ type: SHOW_SNACKBAR, message: "You're signed out" });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationMenu);