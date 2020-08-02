import React, { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Spinner from '../popups/Spinner';
import PromptModal from '../popups/PromptModal';
import {
  TOGGLE_PROFILE_EDITOR,
  UPDATE_PROFILE_EDITOR
} from '../../actions';
import FileBase from 'react-file-base64';
import { highlightedNumberStyle } from '../../styles';
import "../../index.css";

const imageStyle = {
  width: '120px',
  height: '120px',
  margin: 'auto',
  border: '1.5px solid white',
  background: 'radial-gradient(black, black, black, black, #222222, #333333, #333333, grey, grey)'
}

const editPhotoButtonStyle = {
  top: '5px',
  color: 'white',
  fontSize: '16px'
};

const ProfileAvatar = props => {

  const [isModalVisible, setModalVisible] = useState(false);

  const onImageChange = file => {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setModalVisible(true);
    } else {
      const data = file.base64.toString();
      props.updateProfileEditor(data);
    }
  }

  const {
    isSpinnerVisible,
    displayUserDetail,
    displayUser: { firstName, lastName },
    profileEditor
  } = props;

  const profileImageLoaded = !!profileEditor
    ? !!profileEditor.profileImage
    : !!displayUserDetail && displayUserDetail.profileImage;
  
  return (
    <div>
      <PromptModal
        modalType="okay"
        isVisible={isModalVisible}
        closeModal={() => setModalVisible(false)}
        message={"Invalid file type. Please choose a PNG or JPEG file."}
      />
      {isSpinnerVisible && <Spinner/>}
      <div style={{height:'120px', textAlign:'center'}}>
      {profileImageLoaded
      ? <Avatar
          alt="Profile"
          src={!!profileEditor
            ? profileEditor.profileImage
            : displayUserDetail.profileImage
          }
          style={imageStyle}
        />
      : <Avatar alt="Profile" style={imageStyle}>
          <div style={{textAlign:'center'}}>
            <Typography style={highlightedNumberStyle}>
              {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </Typography>
          </div>
        </Avatar>
      }
      {!!profileEditor &&
        <label style={editPhotoButtonStyle} className="fileContainer">
          Change Profile Photo
          <FileBase type="file" onDone={onImageChange}/>
        </label>
      }
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
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