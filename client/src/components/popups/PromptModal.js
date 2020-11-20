import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { deleteButtonStyle, cancelButtonStyle } from '../../styles';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    background: '#303030',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: isMobileOnly ? '300px' : '400px'
  },
  button: {
    float: 'right',
    height: '30px',
    margin: '10px 0 0 10px',
    padding: '5px 10px',
    fontWeight: 'bold'
  }
}));

const PromptModal = ({ modalType, isVisible, closeModal, message, onConfirm, onConfirmParam }) => {
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isVisible}
      onClose={e => {
        e.stopPropagation();
        closeModal();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={isVisible}>
        <Grid container direction="column" className={classes.paper}>
          <Grid item>
            <h3 id="transition-modal-title">{message}</h3>
          </Grid>
          {modalType === "delete"
          ? <Grid item>
              <Button
                className={classes.button}
                style={deleteButtonStyle}
                onClick={e => {
                  e.stopPropagation();
                  onConfirm(onConfirmParam)
                }}
              >
                Delete
              </Button>
              <Button
                className={classes.button}
                style={cancelButtonStyle}
                onClick={e => {
                  e.stopPropagation();
                  closeModal();
                }}
              >
                Cancel
              </Button>
            </Grid>
          : <Grid item>
              <Button
                className={classes.button}
                style={cancelButtonStyle}
                onClick={e => {
                  e.stopPropagation();
                  closeModal();
                }}
              >
                Okay
              </Button>
            </Grid>
          }
        </Grid>
      </Fade>
    </Modal>
  );
}

export default PromptModal;