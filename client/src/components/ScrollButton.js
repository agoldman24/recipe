import React from 'react';
import Button from '@material-ui/core/Button';
import { defaultTheme } from '../variables/Constants';
import { isMobile } from 'react-device-detect';

export default function ScrollButton() {
  const buttonStyle = {
    color: 'black',
    fontWeight: 'bold',
    borderRadius: '20px',
    background: defaultTheme.palette.primary.mainGradient
  }
  return (
    <div style={{
      position:'fixed',
      width:'100vw',
      top:'60px',
      textAlign:'center',
      zIndex:'1'
    }}>
      <Button
        style={buttonStyle}
        onClick={() => {
          if (isMobile) {
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
          } else {
            document.getElementById('container').scroll({
              top: 0, left: 0, behavior: 'smooth'
            });
          }
        }}
      >
        Scroll to top
      </Button>
    </div>
  );
}