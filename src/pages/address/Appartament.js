import { Paper } from '@material-ui/core';
import React, { useState } from 'react';

export const Appartament = ({
  classes,
  item,
  onClick: _onClick,
  setAnchorEl,
}) => {

  const handleClick = (event) => {
    if (_onClick) {
      _onClick();
      setAnchorEl(event.currentTarget);
    } 
  };

  let color = "#FFFFFF";
  if (item.b_check) {
    color = "#a3d9a3";
  }
  if (item.b_check === false) {
    color = "#d9a3a3";
  }
  return (
    <Paper
      style={{
        backgroundColor: `${color}`,
      }}
      className={classes.paper}
      elevation={3}
      onClick={handleClick}
    >
      <div className={classes.textPaper}>{item.c_number}</div>
    </Paper>
  );
};
