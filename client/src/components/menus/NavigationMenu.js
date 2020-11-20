import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Fab from '@material-ui/core/Fab';
import DrawerMenu from './DrawerMenu';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SET_ACTIVE_TAB, CLEAR_ERROR_MESSAGES } from '../../actions';
import { RECIPE_TAB, USERS_TAB, WELCOME_TAB } from '../../variables/Constants';
import { defaultTheme } from '../../styles';

const fabStyle = {
  position: 'fixed',
  right: isMobileOnly ? 10 : 20,
  bottom: isMobileOnly ? 10 : 'initial',
  top: isMobileOnly ? 'initial' : 10,
  background: isMobileOnly
    ? 'linear-gradient(to top left, #202020, grey)'
    : 'linear-gradient(to top right, #202020, grey)',
  boxShadow: 'none',
  color: defaultTheme.palette.primary.main,
  zIndex: '3'
};

const tabStyle = {
  fontSize:'13px'
};

const NavigationMenu = props => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navBarZindex, setNavBarZindex] = useState('initial');
  const navBarStyle = {
    width: '100%', height: '50px', left: '0', position: 'fixed',
    backgroundImage: props.isLoggedIn ? 'linear-gradient(black, #202020)' : 'none',
    zIndex: isMobileOnly ? '4' : navBarZindex
  };

  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Paper square>
      {props.isLoggedIn
      ? <Tabs
          value={props.highlightTab ? props.activeTab.name : false}
          style={navBarStyle}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => {
            props.clearFailureMessages();
            props.setActiveTab(newValue);
          }}
        >
          <Tab style={tabStyle} label="Users" value={USERS_TAB}/>
          <Tab style={tabStyle} label="Recipes" value={RECIPE_TAB}/>
          <DrawerMenu
            open={isDrawerOpen}
            toggleDrawer={() => {
              setIsDrawerOpen(!isDrawerOpen);
              if (isDrawerOpen) {
                setTimeout(() => setNavBarZindex('initial'), 500);
              } else {
                setNavBarZindex('4');
              }
            }}
            toggleCreateMode={props.toggleCreateMode}
          />
        </Tabs>
      : props.activeTab.name !== WELCOME_TAB
        ? <Fab style={fabStyle} onClick={() => props.setActiveTab(WELCOME_TAB)}>
            <HomeOutlinedIcon style={{height:'40', width:'40'}}/>
          </Fab>
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
    highlightTab: state.activeTab.name === USERS_TAB
      || state.activeTab.name === RECIPE_TAB
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB,
      currentTab: null,
      newTab: { name }
    }),
    clearFailureMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationMenu);