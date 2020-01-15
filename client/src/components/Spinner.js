import React from 'react';

export default function Spinner() {
  return (
    <div>
      <div
        className="ui segment"
        style={{
          position:"absolute",
          opacity:"0.7",
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