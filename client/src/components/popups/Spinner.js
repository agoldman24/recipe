import React from 'react';

export default function Spinner() {
  return (
    <div
      className="ui active inverted massive text loader"
      style={{
        position:"fixed",
        fontSize:"50px",
        zIndex: 9999
      }}
    />
  );
};