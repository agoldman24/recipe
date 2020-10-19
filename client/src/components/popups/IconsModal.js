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
import Api from '../../api/siteUrl';
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
    width: isMobileOnly ? '300px' : '400px'
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
    width: isMobileOnly ? '71.5%' : '79%',
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
  const { isVisible, closeModal, onConfirm } = props;
  const [searchVal, setSearchVal] = useState("");
  const [lastSearchVal, setLastSearchVal] = useState("");
  const [icons, setIcons] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (isFetching) {
      setMessage("");
      if (searchVal.trim() === lastSearchVal.trim()) {
        setIcons([]);
      }
      setLastSearchVal(searchVal);
      const wordArray = searchVal.split(' ');
      const queryString = wordArray.reduce((accum, current, index) => {
        accum += current;
        if (index < wordArray.length - 1) {
          accum += '%20';
        }
        return accum;
      }, "");
      Api.get('/getIcons?searchWord=' + queryString)
        .then(res => {
          if (!!res.data.icons && !!res.data.icons.length) {
            setIcons(res.data.icons.map(icon => ({ url: icon, isLoading: true })));
          } else {
            setIcons([]);
            setIsFetching(false);
            setMessage("No icons found, try another search");
          }
        })
        .catch(() => {
          setIcons([]);
          setIsFetching(false);
          setMessage("No icons found, try another search");
        });
    }
  }, [isFetching, searchVal]);
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
                setIsFetching(true);
              }}
            >
              {isFetching ? <CircularProgress size={20} style={{color:'white'}}/> : "Search"}
            </Button>
          </Grid>
          <Grid item><p style={{fontSize:'14px', paddingLeft:'5px'}}>{message}</p></Grid>
          {!!icons.length &&
          [0,1,2,3,4].map(row =>
            <Grid container direction="column" key={"row_" + row}>
              <Grid container direction="row">
                {[0,1,2,3].map(column => !!icons[4*row + column] &&
                <Grid item className="iconContainer" key={"row_" + row + "_column_" + column}
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