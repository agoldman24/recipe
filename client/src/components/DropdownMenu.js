import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { SIGN_OUT, SET_ACTIVE_TAB } from '../actions';
import { RECIPE_TAB } from '../variables/Constants';

const DropdownMenu = props => {
  const [buttonOpacity, setButtonOpacity] = useState('0.7'); 
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
    if (buttonOpacity === '0.7') {
      setButtonOpacity('1.0');
    } else {
      setButtonOpacity('0.7');
    }
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    setButtonOpacity('0.7');
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div style={{display:'flex'}}>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        style={{width:'33.33vw', fontSize:'13px', opacity: buttonOpacity}}
        startIcon={<AccountCircleIcon />}
        onClick={handleToggle}
      >
        {props.activeUser.firstName}
      </Button>
      <Popper
        open={open}
        role={undefined}
        transition disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <div style={{width:'100vw', marginTop:'50px'}}>
            <Paper style={{float:'right', backgroundImage:'linear-gradient(#202020, black)'}}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>Favorites</MenuItem>
                  <MenuItem onClick={props.signOut}>Sign Out</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
            </div>
          </Grow>
        )}
      </Popper>
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
    signOut: () => {
      dispatch({ type: SET_ACTIVE_TAB, tab: RECIPE_TAB });
      dispatch({ type: SIGN_OUT });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropdownMenu);