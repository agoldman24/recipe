import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SET_ACTIVE_TAB } from '../actions';
import { connect } from 'react-redux';
import { SIGN_UP_TAB, RECIPES_TAB, SIGN_IN_TAB } from '../variables/Constants';

const TabPanel = props => {

  const handleChange = (event, newValue) => {
    props.setActiveTab(newValue)
  };

  return (
    <Paper
      square
    >
      <Tabs
        value={props.activeTab}
        style={{width:"100vw", left:"0"}}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChange}
      >
        <Tab label="Sign Up" value={SIGN_UP_TAB}/>
        <Tab label="Recipes" value={RECIPES_TAB}/>
        <Tab label="Sign In" value={SIGN_IN_TAB}/>
      </Tabs>
    </Paper>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab
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