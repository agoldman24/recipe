import React, { useState} from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Spinner from '../popups/Spinner';
import IconsModal from '../popups/IconsModal';
import PromptModal from '../popups/PromptModal';
import {
  TOGGLE_PROFILE_EDITOR,
  UPDATE_PROFILE_EDITOR
} from '../../actions';
import FileBase from 'react-file-base64';
import { b64toBlob } from '../../utilities/imageConverter';
import { highlightedNumberStyle } from '../../styles';
import "../../index.css";

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px',
    border: '1px solid white',
    marginTop: '5px'
  }
}));

const editPhotoButtonStyle = {
  top: '5px',
  color: 'white',
  fontSize: '16px'
};

const ProfileAvatar = props => {
  const {
    isSpinnerVisible,
    displayUserDetail,
    displayUser: { firstName, lastName },
    profileEditor
  } = props;

  const profileImageLoaded = !!profileEditor
    ? !!profileEditor.profileImage
    : !!displayUserDetail && !!displayUserDetail.profileImage;

  const classes = useStyles();
  const [isIconsModalVisible, setIconsModalVisible] = useState(false);
  const [isFileTypeModalVisible, setFileTypeModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const imageStyle = {
    width: '120px',
    height: '120px',
    margin: 'auto',
    border: '1.5px solid white',
    background: profileImageLoaded
      ? '#333333'
      : 'radial-gradient(black, black, black, black, #222222, #333333, #333333, grey, grey)'
  }

  const onImageChange = file => {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setFileTypeModalVisible(true);
    } else {
      const data = file.base64.toString();
      const imageUrl = URL.createObjectURL(b64toBlob(data));
      props.updateProfileEditor(imageUrl);
      setAnchorEl(null);
    }
  }
  
  return (
    <div>
      <IconsModal
        isVisible={isIconsModalVisible}
        closeModal={() => setIconsModalVisible(false)}
        onConfirm={icon => props.updateProfileEditor(icon)}
      />
      <PromptModal
        modalType="okay"
        isVisible={isFileTypeModalVisible}
        closeModal={() => setFileTypeModalVisible(false)}
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
        <label style={editPhotoButtonStyle} className="fileContainer"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          Change Profile Photo
        </label>
      }
      </div>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: classes.paper
        }}
      >
        <Grid container direction="column">
          <Grid item style={{background:'#292929', borderBottom: '1px solid white', padding:'10px'}}>
            <label className="fileContainer" style={{fontSize:'16px'}}>
              Upload Photo
              <FileBase type="file" onDone={onImageChange}/>
            </label>
          </Grid>
          <Grid item style={{background:'#292929'}}>
            <Button
              className={classes.button}
              style={{fontSize: '16px', width:'100%', fontFamily: 'Signika'}}
              onClick={() => {
                setIconsModalVisible(true);
                setAnchorEl(null);
              }}
            >
              Choose icon
            </Button>
          </Grid>
        </Grid>
      </Popover>
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
    updateProfileEditor: imageUrl => {
      dispatch({
        type: UPDATE_PROFILE_EDITOR,
        imageUrl
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileAvatar);