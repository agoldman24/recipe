import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { SIGNOUT } from '../actions';

const DropdownMenu = props => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const itemStyle = {width:'200px'};

  return (
    <div style={{display:'flex'}}>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        style={{width:'33.33vw'}}
        startIcon={<AccountCircleIcon />}
        onClick={handleToggle}
      >
        {props.activeUser.firstName}
      </Button>
      <Popper style={{float:'right'}} open={open} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <div style={{width:'100vw', marginTop:'50px'}}>
            <Paper style={{float:'right'}}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem style={itemStyle} onClick={handleClose}>Profile</MenuItem>
                  <MenuItem style={itemStyle} onClick={handleClose}>Favorites</MenuItem>
                  <MenuItem style={itemStyle} onClick={props.signOut}>Sign Out</MenuItem>
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
    signOut: () => dispatch({ type: SIGNOUT })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropdownMenu);