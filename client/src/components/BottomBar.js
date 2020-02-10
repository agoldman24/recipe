import React from 'react';

export default function() {
  return (
    <div>
      <div style={{
        position:'fixed',
        width:'100vw',
        height:'50px',
        bottom:'0',
        background: 'black',
        zIndex:'1'
      }}/>
      <div style={{
        position:'fixed',
        width:'100vw',
        height:'100px',
        bottom:'50px',
        backgroundImage:'linear-gradient(rgba(0,0,0,0), black)',
        zIndex:'1'
      }}/>
    </div>
  )
}