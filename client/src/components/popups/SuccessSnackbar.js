import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Zoom from '@material-ui/core/Zoom';
import { HIDE_SNACKBAR } from '../../actions';

function SlideTransition(props) {
  return <Zoom {...props} />
}

const SuccessSnackbar = props => {
  return (
    <div style={{width:'100%'}}>
      <Snackbar
        open={props.snackbar.isVisible}
        autoHideDuration={1000}
        TransitionComponent={SlideTransition}
        onClose={props.hideSnackbar}
        style={{top:'0'}}
      >
        <MuiAlert>{props.snackbar.message}</MuiAlert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    snackbar: state.snackbar
  };
}

const mapDispatchToProps = dispatch => {
  return {
    hideSnackbar: () => dispatch({ type: HIDE_SNACKBAR })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessSnackbar);