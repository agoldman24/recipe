import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { HIDE_SNACKBAR } from '../actions';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SuccessSnackbar = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Snackbar
        open={props.isSnackbarVisible}
        autoHideDuration={3000}
        onClose={props.hideSnackbar}
      >
        <Alert onClose={props.hideSnackbar} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isSnackbarVisible: state.isSnackbarVisible
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