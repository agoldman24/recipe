import React from 'react';

const Spinner = () => {
  return (
    <div>
      <div
        className="ui segment"
        style={{
          position:"fixed",
          opacity:"0.5",
          top:"0",
          left:"0",
          width:"100%",
          height:"100%",
          border:"none"
        }}
      >
        <div className="ui active dimmer" />
      </div>
      <div
        className="ui active inverted massive text loader"
        style={{
          position:"fixed",
          fontSize:"50px"
        }}
      />
    </div>
  );
};

export default Spinner;