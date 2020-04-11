import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import Fab from '@material-ui/core/Fab';
import DrawerMenu from './DrawerMenu';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SET_ACTIVE_TAB, CLEAR_ERROR_MESSAGES } from '../actions';
import { connect } from 'react-redux';
import {
  SIGN_UP_TAB, SIGN_IN_TAB, RECIPE_TAB,
  SEARCH_TAB, WELCOME_TAB, defaultTheme
} from '../variables/Constants';

const NavigationMenu = props => {

  const handleChange = (event, newValue) => {
    props.clearFailureMessages();
    props.setActiveTab(newValue);
  };

  const navBarStyle = {
    width:'100%', height:'50px', left:'0', position:'fixed', zIndex:'4',
    backgroundImage:'linear-gradient(black, #202020)'
  };

  const tabStyle = {
    fontSize:'13px'
  };

  const fabStyle = {
    position: 'fixed',
    right: 5,
    background: 'none',
    boxShadow: 'none',
    color: 'white',
  };

  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Paper square>
      {props.isLoggedIn
      ? <Tabs
          value={props.highlightTab ? props.activeTab : false}
          style={navBarStyle}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab style={tabStyle} label="Users" value={SEARCH_TAB}/>
          <Tab style={tabStyle} label="Recipes" value={RECIPE_TAB}/>
          <DrawerMenu />
        </Tabs>
      : props.activeTab !== WELCOME_TAB
        ? <div style={navBarStyle}>
            <Fab
              style={fabStyle}
              onClick={() => props.setActiveTab(WELCOME_TAB)}
            >
              <HomeIcon style={{height:'40', width:'40'}}/>
            </Fab>
          </div>
        : null
      }
      </Paper>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    isLoggedIn: !!state.activeUser,
    highlightTab: state.activeTab === SEARCH_TAB || state.activeTab === RECIPE_TAB
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab }),
    clearFailureMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationMenu);