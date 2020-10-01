import React from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import FileBase from 'react-file-base64';
import {
  borderStyle, sectionTitleStyle, rightSideActionStyle, fullWidth,
  iconStyle, iconButtonStyle, errorMessageStyle
} from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%'
  }
}));

const roundedButtonStyle = {
  width: '80%',
  color: 'orange',
  border: '2px solid orange',
  fontWeight: 'bold',
  borderRadius: '50px',
  background: '#292929',
  margin: '5px 10%'
}

export default function RecipeImage({
  focusedContainer,
  originalImage,
  isImageEmpty,
  isErrored,
  image, setImage,
  setFocus,
  setGlobalDiff,
  anchorEl, setAnchorEl,
  setIconsModalVisible,
  onImageChange
}) {
  const classes = useStyles();
  return (
    <Grid container direction="row">
      <Grid item style={{
        width: focusedContainer !== "image" && isImageEmpty && isErrored ? '65%' : '100%'
      }}>
        <Collapse
          in={focusedContainer === "image"}
          classes={{wrapper: classes.wrapper}}
          style={borderStyle(
            focusedContainer,
            "image",
            isImageEmpty && isErrored
          )}
          collapsedHeight={50}
          onClick={e => {
            if (focusedContainer !== "image") {
              e.stopPropagation();
              setFocus("image");
            }
          }}
        >
          <Grid container direction="column">
            <Grid item style={{...fullWidth, padding:'10px 10px 5px 10px'}}>
              <Typography
                style={{
                  ...sectionTitleStyle(focusedContainer, "image"),
                  fontStyle: image === originalImage ? 'normal' : 'italic'
                }}
              >
                Image*
              </Typography>
              <div style={rightSideActionStyle}>
                {focusedContainer === "image"
                ? !!image && <Fab
                    style={iconButtonStyle}
                    onClick={e => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget)
                    }}
                  >
                    <MenuRoundedIcon
                      style={{
                        ...iconStyle,
                        background: !!anchorEl ? '#292929' : 'none'
                      }}
                    />
                  </Fab>
                : <Fab
                    style={iconButtonStyle}
                    onClick={e => {
                      if (focusedContainer !== "image") {
                        e.stopPropagation();
                        setFocus("image");
                      }
                    }}
                  >
                    <ExpandMoreIcon />
                  </Fab>
                }
              </div>
            </Grid>
          </Grid>
          <Card style={{width:'95%', margin:'auto', boxShadow:'none'}}>
            {!!image
            ? <CardMedia
                image={image}
                style={{
                  height: !!image
                    ? isMobile ? '320px' : '280px'
                    : 'initial',
                  width: '350px',
                  padding: '0',
                  margin: 'auto',
                  borderRadius: '10px 10px 0 0'
                }}
              />
            : <div style={{paddingBottom:'10px'}}>
                <Button style={roundedButtonStyle}
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  Upload Photo
                  <label className="fileContainer" id="fileUpload">
                    <FileBase type="file" onDone={onImageChange}/>
                  </label>
                </Button>
                <Button style={roundedButtonStyle} onClick={() => setIconsModalVisible(true)}>
                  Choose Icon
                </Button>
              </div>
            }
          </Card>
        </Collapse>
      </Grid>
      {focusedContainer !== "image" && isImageEmpty && isErrored &&
        <Grid item style={errorMessageStyle}>
          Please choose an image
        </Grid>
      }
    </Grid>
  )
}