import React, { useState } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { defaultTheme, formTheme, errorStyle } from "../../styles";
import {
  SIGN_UP_REQUESTED,
  SET_ACTIVE_TAB,
  EMPTY_FIELDS,
  CLEAR_ERROR_MESSAGES,
} from "../../actions";
import { SIGN_IN_TAB } from "../../variables/Constants";

const useStyles = makeStyles(formTheme);
const errStyle = { ...errorStyle, paddingTop: "0", paddingBottom: "20px" };

const SignUpTab = (props) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    props.clearErrorMessages();
    if (!firstName || !lastName || !username || !password) {
      props.putEmptyFieldsError();
    } else {
      props.signUp(firstName, lastName, username, password);
    }
  };

  return (
    <Dialog
      open={true}
      classes={{
        root: classes.dialogRoot,
        paper: classes.dialogPaper,
        container: classes.dialogContainer,
      }}
      BackdropProps={{
        classes: {
          root: classes.backdropRoot,
        },
      }}
    >
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            style={{ fontFamily: "Signika" }}
          >
            Sign up
          </Typography>
          <form className={classes.form}>
            {props.emptyFields && (
              <div style={errStyle}>One or more fields is empty</div>
            )}
            {props.usernameExists && (
              <div style={errStyle}>
                That username already exists, choose a different one
              </div>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText,
                    },
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText,
                    },
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputTextLowercase,
                    },
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Username"
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText,
                    },
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              type="submit"
              onClick={onFormSubmit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  href="#"
                  style={{ color: defaultTheme.palette.primary.main }}
                  onClick={() => {
                    props.clearErrorMessages();
                    props.setActiveTab(SIGN_IN_TAB);
                  }}
                >
                  Already have an account? Log In
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    emptyFields: state.errorMessages.emptyFields,
    usernameExists: state.errorMessages.usernameExists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putEmptyFieldsError: () => dispatch({ type: EMPTY_FIELDS }),
    clearErrorMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
    signUp: (firstName, lastName, username, password) =>
      dispatch({
        type: SIGN_UP_REQUESTED,
        firstName,
        lastName,
        username,
        password,
      }),
    setActiveTab: (name) =>
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpTab);
