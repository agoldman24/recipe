import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { TOGGLE_MODAL } from '../../actions';
import { deleteButtonStyle, cancelButtonStyle } from '../../styles';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: isMobile ? '250px' : '400px'
  },
  button: {
    float: 'right',
    height: '30px',
    margin: '10px 0 0 10px',
    padding: '5px 10px',
    fontWeight: 'bold'
  }
}));

const PromptModal = ({ modal, toggleModal }) => {
  const classes = useStyles();
  const message = modal.isVisible
    ? "Are you sure you want to delete item '" + modal.actionPayload.item + "'?"
    : "";
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modal.isVisible}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modal.isVisible}>
          <Grid container direction="column" className={classes.paper}>
            <Grid item>
              <h3 id="transition-modal-title">{message}</h3>
            </Grid>
            <Grid item>
              <Button className={classes.button} style={deleteButtonStyle}>Delete</Button>
              <Button className={classes.button} style={cancelButtonStyle}>Cancel</Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
}

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch({ type: TOGGLE_MODAL })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromptModal);