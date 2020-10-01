import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_ICONS_REQUESTED } from '../../actions';
import '../../index.css';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: isMobile ? '300px' : '400px'
  },
  button: {
    float: 'right',
    height: '35px',
    background: 'black',
    border: '1px solid grey'
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    margin: '8px 13px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: isMobile ? '71.5%' : '79%',
    outline: '1px solid white',
    background: '#202020',
    fontSize: '16px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%'
  }
}));

const IconsModal = props => {
  const classes = useStyles();
  const { isVisible, closeModal, onConfirm, iconFetchMessage } = props;
  const [searchVal, setSearchVal] = useState("");
  const [icons, setIcons] = useState([]);
  useEffect(() => {
    setIcons(props.icons.map(icon => ({ url: icon, isLoading: true })));
  }, [props.icons]);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isVisible}
        onClose={e => {
          e.stopPropagation();
          closeModal();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isVisible}>
          <Grid container direction="column" className={classes.paper}
            style={{paddingBottom:'5px', paddingRight:'5px'}}
          >
            <Grid item style={{height:'55px', width:'97.5%'}}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search icons..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onKeyPress={event => {
                  if (!!searchVal.length && event.charCode === 13) {
                    document.getElementById('search').click();
                  }
                }}
                autoFocus
                inputProps={{'aria-label':'search'}}
                onClick={e => e.stopPropagation()}
                onChange={e => setSearchVal(e.target.value.toLowerCase())}
              />
              <Button id="search"
                className={classes.button}
                disabled={!searchVal.length}
                onClick={e => {
                  e.stopPropagation();
                  props.getIcons(searchVal)
                }}
              >
                Search
              </Button>
            </Grid>
            {!!icons.length &&
            [0,1,2,3,4].map(row =>
              <Grid container direction="column" key={"row_" + row}>
                <Grid container direction="row">
                  {[0,1,2,3].map(column => !!icons[4*row + column] &&
                  <Grid item className="iconContainer" key={"row_" + row + "_column_" + column}
                    style={{
                      width: isMobile ? '68px' : '90px',
                      padding: isMobile ? '1px 0 1px 2px' : '5px 0 5px 10px',
                      borderRadius: '10px'
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      onConfirm(icons[4*row + column].url);
                      closeModal();
                    }}
                  >
                    <CircularProgress size={isMobile ? 45 : 65} style={{
                      display: icons[4*row + column].isLoading ? 'block' : 'none'
                    }}/>
                    <img alt="icon" src={icons[4*row + column].url}
                      onLoad={() => {
                        let currentIcons = [...icons];
                        currentIcons[4*row + column].isLoading = false;
                        setIcons(currentIcons);
                      }}
                      height={isMobile ? "46px" : "65px"} style={{
                        display: icons[4*row + column].isLoading ? 'none' : 'block',
                        maxWidth: isMobile ? '65px' : '85px'
                    }}/>
                  </Grid>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid item>
              <p style={{fontSize:'14px', paddingLeft:'5px'}}>{iconFetchMessage}</p>
            </Grid>
            <Grid item style={{width:'100%'}}>
              <Button style={{float:'right'}}
                onClick={e => {
                  e.stopPropagation();
                  closeModal();
                }}
              >Close</Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    icons: state.icons,
    iconFetchMessage: state.iconFetchMessage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getIcons: searchWord => dispatch({ type: GET_ICONS_REQUESTED, searchWord })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IconsModal);