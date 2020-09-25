import React from 'react';
import Fab from '@material-ui/core/Fab';
import { defaultTheme } from '../../styles';
import { isMobile } from 'react-device-detect';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default function ScrollButton({ scrollButtonTop, zIndex }) {
  const buttonStyle = {
    color: 'black',
    fontWeight: 'bold',
    float: 'right',
    marginRight: '1.5%',
    background: defaultTheme.palette.primary.mainGradient
  }
  return (
    <div style={{
      position: 'fixed',
      width: '100vw',
      top: scrollButtonTop,
      textAlign: 'center',
      zIndex
    }}>
      <Fab
        style={buttonStyle}
        size="small"
        onClick={() => {
          const id = isMobile ? 'root' : 'container';
          document.getElementById(id).scroll({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        <KeyboardArrowUpIcon style={{ height:'25', width:'25' }}/>
      </Fab>
    </div>
  );
}