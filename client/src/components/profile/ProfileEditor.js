import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PromptModal from "../popups/PromptModal";
import { UPDATE_PROFILE_EDITOR, DELETE_USER_REQUESTED } from "../../actions";
import { formTheme, deleteButtonStyle } from "../../styles";

const useStyles = makeStyles(formTheme);

const cellStyle = {
  padding: "5px",
  borderBottom: "none",
};

const textStyle = {
  fontFamily: "Signika",
  fontSize: "16px",
  float: "left",
  width: "80px",
};

const ProfileEditor = (props) => {
  const classes = useStyles();
  const inputProps = {
    classes: {
      input: classes.inputText,
    },
  };
  const [firstName, setFirstName] = useState(
    !props.activeUser ? "" : props.activeUser.firstName
  );
  const [lastName, setLastName] = useState(
    !props.activeUser ? "" : props.activeUser.lastName
  );
  const [username, setUsername] = useState(
    !props.activeUser ? "" : props.activeUser.username
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>First Name</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={inputProps}
                variant="outlined"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  props.updateFirstName(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>Last Name</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={inputProps}
                variant="outlined"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  props.updateLastName(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>Username</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={inputProps}
                variant="outlined"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  props.updateUsername(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        variant="outlined"
        style={{
          ...deleteButtonStyle,
          width: "94%",
          margin: "0 3%",
          borderRadius: "50px",
        }}
        onClick={() => setIsDeleteModalVisible(true)}
      >
        Delete Account
      </Button>
      <PromptModal
        modalType="action"
        actionText="Delete"
        isVisible={isDeleteModalVisible}
        closeModal={() => setIsDeleteModalVisible(false)}
        onConfirm={() => {
          setIsDeleteModalVisible(false);
          props.closeProfileEditor();
          props.deleteUser();
        }}
        message={"Are you sure you want to delete your account?"}
      />
    </TableContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    activeUser: state.activeUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: () => dispatch({ type: DELETE_USER_REQUESTED }),
    updateFirstName: (firstName) =>
      dispatch({ type: UPDATE_PROFILE_EDITOR, firstName }),
    updateLastName: (lastName) =>
      dispatch({ type: UPDATE_PROFILE_EDITOR, lastName }),
    updateUsername: (username) =>
      dispatch({ type: UPDATE_PROFILE_EDITOR, username }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditor);
