import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SET_ACTIVE_TAB } from '../actions';
import { SIGN_UP_TAB, RECIPES_TAB, defaultTheme } from '../variables/Constants';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor:defaultTheme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = props => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              type="submit"
              onClick={() => props.setActiveTab(RECIPES_TAB)}
            >
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  onClick={() => props.setActiveTab(SIGN_UP_TAB)}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);