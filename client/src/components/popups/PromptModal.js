import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { TOGGLE_MODAL } from '../../actions';

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
    padding: theme.spacing(2, 4, 3),
  },
}));

const PromptModal = ({ modal, toggleModal }) => {
  const classes = useStyles();
  const message = modal.isVisible
    ? "Are you sure you want to delete item '" + modal.actionPayload.item + "'?"
    : "";
  return (
    <div style={{width:'100%'}}>
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
          <div className={classes.paper}>
            <h3 id="transition-modal-title">{message}</h3>
          </div>
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