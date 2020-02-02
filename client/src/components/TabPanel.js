import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DropdownMenu from './DropdownMenu';
import CreateIcon from '@material-ui/icons/Create';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SET_ACTIVE_TAB } from '../actions';
import { connect } from 'react-redux';
import { SIGN_UP_TAB, SIGN_IN_TAB, RECIPE_TAB, CREATE_TAB, defaultTheme }
from '../variables/Constants';

const TabPanel = props => {

  const handleChange = (event, newValue) => {
    props.setActiveTab(newValue)
  };

  const tabStyle = {fontSize:'13px'};

  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Paper square>
      {props.isLoggedIn
        ? <Tabs
            value={props.activeTab}
            style={{width:"100%", left:"0"}}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
          >
            <Tab
              style={tabStyle}
              label={<div><CreateIcon style={{verticalAlign: 'top'}}/> Create</div>}
              value={CREATE_TAB}
            />
            <Tab style={tabStyle} label="Recipes" value={RECIPE_TAB}/>
            <DropdownMenu />
          </Tabs>
        : <Tabs
            value={props.activeTab}
            style={{width:"100%", left:"0"}}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
          >
            <Tab style={tabStyle} label="Sign Up" value={SIGN_UP_TAB}/>
            <Tab style={tabStyle} label="Recipes" value={RECIPE_TAB}/>
            <Tab style={tabStyle} label="Sign In" value={SIGN_IN_TAB}/>
          </Tabs>
        }
      </Paper>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    isLoggedIn: state.isLoggedIn,
    activeUser: state.activeUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabPanel);