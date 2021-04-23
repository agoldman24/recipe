import React, { useState, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    padding: theme.spacing(2),
    width: isMobileOnly ? '300px' : '400px',
    height: isMobileOnly ? '368px' : '490px'
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
    if (searchVal.length > 0) {
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
    } else {
      setIcons([]);
      setIsFetching(false);
    }
  }, [searchVal]);

  return (
    <Modal
      className={classes.modal}
      open={isVisible}
      onClose={e => {
        e.stopPropagation();
        closeModal();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={isVisible}>
        <Grid container direction="column" className={classes.paper}
          style={{paddingBottom:'5px', paddingRight:'5px'}}
        >
          <Grid item style={{height:'50px', width:'97%'}}>
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
            height: isMobileOnly ? '258px' : '380px'
          }}>
            {!isSpinnerVisible && !icons.length &&
              <div style={{
                width: '97%',
                textAlign: 'center',
                fontSize: '14px'
              }}>No icons found</div>
            }
            {[0,1,2,3,4].map(row =>
              <Grid container direction="column" key={"row_" + row}>
                <Grid container direction="row">
                  {[0,1,2,3].map(column => !!icons[4*row + column] &&
                    <Grid item className="iconContainer"
                      key={"row_" + row + "_column_" + column}
                      style={{
                        width: isMobileOnly ? '68px' : '90px',
                        padding: isMobileOnly ? '1px 0 1px 2px' : '5px 0 5px 10px',
                        borderRadius: '10px'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        onConfirm(icons[4*row + column].url);
                        closeModal();
                      }}
                    >
                      <CircularProgress size={isMobileOnly ? 45 : 65} style={{
                        display: icons[4*row + column].isLoading ? 'block' : 'none'
                      }}/>
                      <img alt="icon" src={icons[4*row + column].url}
                        onLoad={() => {
                          let currentIcons = [...icons];
                          currentIcons[4*row + column].isLoading = false;
                          setIcons(currentIcons);
                          setIsFetching(false);
                        }}
                        height={isMobileOnly ? "46px" : "65px"} style={{
                          display: icons[4*row + column].isLoading ? 'none' : 'block',
                          maxWidth: isMobileOnly ? '65px' : '85px'
                      }}/>
                    </Grid>
                    )}
                  </Grid>
                </Grid>
            )}
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
  );
}

export default IconsModal;