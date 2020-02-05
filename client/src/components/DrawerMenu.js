import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { SIGN_OUT, SET_ACTIVE_TAB } from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

const useStyles = makeStyles({
  list: {
    width: 250,
    paddingTop:'50px'
  }
});

const DrawerMenu = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => { setOpen(!open) };

  const clickHandler = text => {
    switch (text) {
      case "Profile":
        props.goToProfile();
        break;
      case "Favorites":
        break;
      case "Sign Out":
        props.signOut();
        break;
      default:
        break;
    }
  }

  const getIcon = text => {
    switch (text) {
      case "Profile":
        return <PersonIcon/>
      case "Favorites":
        return <FavoriteIcon />;
      case "Sign Out":
        return <ExitToAppIcon />;
      default:
        return null;
    }
  }

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {['Profile', 'Favorites', 'Sign Out'].map((text, index) => (
          <ListItem
            button
            key={text}
            style={{marginLeft:'10px'}}
            onClick={() => clickHandler(text)}
          >
            <ListItemIcon>{getIcon(text)}</ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div style={{display:'flex'}}>
      <Button
        style={{
          width:'33.33vw',
          fontSize:'13px',
          borderRadius:'0',
          opacity: open ? '1.0' : '0.7',
          background: open
            ? 'linear-gradient(black, #424242)'
            : 'linear-gradient(black, #202020)'
        }}
        startIcon={<AccountCircleIcon />}
        onClick={toggleDrawer}
      >
        {props.activeUser.firstName}
      </Button>
      <SwipeableDrawer
        style={{zIndex:'3'}}
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        {sideList()}
      </SwipeableDrawer>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goToProfile: () => {
      dispatch({ type: SET_ACTIVE_TAB, tab: false });
    },
    signOut: () => {
      dispatch({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      dispatch({ type: SIGN_OUT });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerMenu);