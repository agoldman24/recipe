import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Fab';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Spinner from './Spinner';
import {
  TOGGLE_PROFILE_EDITOR,
  START_FILE_UPLOAD,
  UPDATE_PROFILE_EDITOR,
  UPDATE_USER_REQUESTED
} from '../actions';
import { PROFILE } from '../variables/Constants';
import { connect } from 'react-redux';
import FileBase from 'react-file-base64';
import "../index.css";

const imageStyle = {
  width: '120px',
  height: '120px',
  margin: 'auto',
  fontSize: '30px',
  border: '2px solid black'
}

const editPhotoButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  width: '200px',
  borderRadius: '10px'
};

const ProfileAvatar = props => {

  const onImageChange = files => {
    const data = files.base64.toString();
    props.updateProfileEditor(data);
  }

  const {
    isSpinnerVisible,
    displayUserDetail,
    displayUser: { id, firstName, lastName },
    activeUser,
    profileEditor
  } = props;

  const profileImageLoaded = !!profileEditor
    ? !!profileEditor.profileImage
    : !!displayUserDetail && displayUserDetail.profileImage;
  
  return (
    <div>
      {isSpinnerVisible && <Spinner/>}
      {profileImageLoaded
      ? <div style={{height:'120px'}}>
          <Avatar
            alt="Profile"
            src={
              !!profileEditor
                ? profileEditor.profileImage
                : displayUserDetail.profileImage
            }
            style={imageStyle}
          />
          {!!profileEditor &&
            <Button style={editPhotoButtonStyle} className="fileContainer">
              Change Profile Photo
              <FileBase type="file" onDone={onImageChange}/>
            </Button>
          }
        </div>
      : <Avatar alt="Profile" style={imageStyle}>
          <Grid container direction="column" style={{textAlign:'center'}}>
            <Grid item>
              {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </Grid>
            <Grid item style={{lineHeight:'0.5', paddingBottom:'10px'}}>
            {!!activeUser && activeUser.id === id &&
              <label
                className="fileContainer"
                onClick={() => {
                  props.toggleProfileEditor(
                    props.displayUser.firstName,
                    props.displayUser.lastName,
                    props.displayUserDetail.profileImage
                  );
                  setTimeout(() => props.startFileUpload(), 1);
                }}
              >
                Upload photo
                <FileBase type="file" onDone={onImageChange}/>
              </label>
            }
            </Grid>
          </Grid>
        </Avatar>
      }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    activeUser: state.activeUser,
    profileEditor: state.profileEditor,
    isSpinnerVisible: state.isSpinnerVisible
  };
}

const mapDispatchToProps = dispatch => {
  return {
    toggleProfileEditor: (firstName, lastName, profileImage) => {
      dispatch({
        type: TOGGLE_PROFILE_EDITOR,
        firstName, lastName, profileImage
      });
    },
    startFileUpload: () => dispatch({ type: START_FILE_UPLOAD }),
    updateProfileEditor: imageData => {
      dispatch({
        type: UPDATE_PROFILE_EDITOR,
        imageData
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileAvatar);