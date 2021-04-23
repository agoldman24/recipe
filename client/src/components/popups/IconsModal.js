import React, { useState, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TemporarySpinner from './TemporarySpinner';
import Api from '../../api/siteUrl';
import axios from 'axios';
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
    width: isMobileOnly ? '300px' : '400px',
    height: isMobileOnly ? '355px' : '480px'
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    margin: '8px 10px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: '100%',
    border: '1px solid white',
    borderRadius: '5px',
    background: '#202020',
    fontSize: '16px'
  },
  inputInput: {
    padding: '8px 8px 8px 40px',
    width: '100%'
  }
}));

const CancelToken = axios.CancelToken;
let cancel;

const IconsModal = props => {
  const classes = useStyles();
  const { isVisible, closeModal, onConfirm } = props;
  const [searchVal, setSearchVal] = useState("");
  const [icons, setIcons] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(true);

  useEffect(() => {
    setIsSpinnerVisible(true);
    if (!!searchVal.length) {
      setIsFetching(true);
      if (cancel !== undefined) {
        cancel();
      }
      const wordArray = searchVal.split(' ');
      const queryString = wordArray.reduce((accum, current, index) => {
        accum += current;
        if (index < wordArray.length - 1) {
          accum += '%20';
        }
        return accum;
      }, "");
      Api.get('/getIcons?searchWord=' + queryString, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(res => {
          if (!!res.data.icons && !!res.data.icons.length) {
            setIcons(res.data.icons.map(icon => ({ url: icon, isLoading: true })));
          } else {
            setIcons([]);
          }
        })
        .catch(() => {
          setIcons([]);
        });
    }
  }, [searchVal]);

  return (
    <Modal
      className={classes.modal}
      open={isVisible}
      onClose={e => {
        e.stopPropagation();
        closeModal();
        setSearchVal("");
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={isVisible}>
        <Grid container direction="column" className={classes.paper}>
          <div style={{textAlign:'right'}}>
            <IconButton onClick={() => {
              closeModal();
              setSearchVal("")
            }} style={{
              marginLeft:'-36px',
              padding: '8px',
              position: 'absolute'
            }}>
              <CloseIcon/>
            </IconButton>
          </div>
          <Grid item style={{
            width: '100%',
            padding: '15px 40px 0 15px'  
          }}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search icons..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              autoFocus
              onClick={e => e.stopPropagation()}
              onChange={e => setSearchVal(e.target.value.toLowerCase())}
            />
            <div style={{
              display: 'inline-block',
              position: 'absolute',
              marginLeft: '-35px',
              marginTop: '8px'
            }}>
              {isFetching && isSpinnerVisible &&
                <TemporarySpinner destroySpinner={() => setIsSpinnerVisible(false)}/>
              }
            </div>
          </Grid>
          <Grid item style={{
            height: isMobileOnly ? '290px' : '420px',
            padding: '10px 0 0 15px'
          }}>
            {!isSpinnerVisible && !icons.length && !!searchVal.length &&
              <div style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '14px'
              }}>No icons found</div>
            }
            {!!searchVal.length && [0,1,2,3,4].map(row =>
              <Grid container direction="column" key={"row_" + row}>
                <Grid container direction="row">
                  {[0,1,2,3].map(column => !!icons[4*row + column] &&
                    <Grid item className="iconContainer"
                      key={"row_" + row + "_column_" + column}
                      style={{
                        width: isMobileOnly ? '70px' : '93px',
                        padding: isMobileOnly ? '1px 1px 4px 1px' : '5px',
                        borderRadius: '10px'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        onConfirm(icons[4*row + column].url);
                        closeModal();
                        setSearchVal("")
                      }}
                    >
                      <img alt="icon" src={icons[4*row + column].url}
                        onLoad={() => {
                          let currentIcons = [...icons];
                          currentIcons[4*row + column].isLoading = false;
                          setIcons(currentIcons);
                          setIsFetching(false);
                        }}
                        height={isMobileOnly ? "50px" : "68px"} style={{
                          display: icons[4*row + column].isLoading ? 'none' : 'block',
                          maxWidth: isMobileOnly ? '67px' : '88px'
                      }}/>
                    </Grid>
                    )}
                  </Grid>
                </Grid>
            )}
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  );
}

export default IconsModal;