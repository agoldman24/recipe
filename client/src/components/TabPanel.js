import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SET_ACTIVE_TAB } from '../actions';
import { connect } from 'react-redux';

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
        <Tab label="Sign Up" value={"SignUp"}/>
        <Tab label="Recipes" value={"Recipes"}/>
        <Tab label="Sign In" value={"SignIn"}/>
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