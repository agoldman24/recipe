import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
  list: {
    width: 250,
    paddingTop:'50px'
  }
});

export default function DrawerMenu() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    if (open) setOpen(false);
    else setOpen(true);
  };

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div style={{display:'flex'}}>
      <Button
        //ref={anchorRef}
        //aria-controls={open ? 'menu-list-grow' : undefined}
        //aria-haspopup="true"
        style={{width:'33.33vw', fontSize:'13px'}}
        //startIcon={<AccountCircleIcon />}
        onClick={toggleDrawer}
      >
        TEST
      </Button>
      {/* <Button onClick={toggleDrawer('right', true)}>Open Right</Button> */}
      <SwipeableDrawer
        style={{zIndex:'1'}}
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