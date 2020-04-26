import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Spinner from './Spinner';
import { UPDATE_USER_REQUESTED } from '../actions';
import { PROFILE_IMAGE } from '../variables/Constants';
import { connect } from 'react-redux';
import FileBase from 'react-file-base64';
import "../index.css";

const imageStyle = {
  width: '120px',
  height: '120px',
  marginRight: '20px',
  fontSize: '30px',
  border: '2px solid black'
}

const photoButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  top: '-50px',
  left: '80px'
};

const iconStyle = {
  width:'25',
  height:'25'
};

const ProfileAvatar = props => {

  const onImageChange = files => {
    const data = files.base64.toString();
    props.updateProfileImage(props.activeUser.id, data);
  }

  const {
    displayUserDetail,
    displayUser: { id, firstName, lastName },
    activeUser
  } = props;
  
  return (
    <div>
      {props.isSpinnerVisible && <Spinner/>}
      {!!displayUserDetail && !!displayUserDetail.profileImage
      ? <div style={{height:'120px'}}>
          <Avatar
            alt="Profile"
            src={displayUserDetail.profileImage}
            style={imageStyle}
          />
          {!!activeUser && activeUser.id === id &&
            <Fab style={photoButtonStyle} className="fileContainer">
              <AddAPhotoIcon style={iconStyle}/>
              <FileBase type="file" onDone={onImageChange}/>
            </Fab>
          }
        </div>
      : <Avatar alt="Profile" style={imageStyle}>
          <Grid container direction="column" style={{textAlign:'center'}}>
            <Grid item>
              {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </Grid>
            <Grid item style={{lineHeight:'0.5', paddingBottom:'10px'}}>
            {!!activeUser && activeUser.id === id &&
              <label className="fileContainer">
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
    isSpinnerVisible: state.isSpinnerVisible
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateProfileImage: (id, data) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE_IMAGE,
        id, data
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileAvatar);