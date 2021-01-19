import React, { useEffect, useState } from "react";
import { lighten, makeStyles, TableHead, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  highlight: {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.main, 0.85),
  },
}));

export function EnhancedTableHead(props) {
  const {
    title,
    numSelected
  } = props;
  // const createSortHandler = (property) => (event) => {
  //   onRequestSort(event, property);
  // };

  const classes = useStyles();
  return (
    <TableHead>
      <Toolbar
        className={classes.highlight}
        // className={classNames({
        //   [classes.highlight]: numSelected > 0,
        // })}
      >
        {numSelected > 0 ? (
          <Typography variant="subtitle1">Выбрано: {numSelected}</Typography>
        ) : (
          <Typography variant="h6">{title}</Typography>
        )}
      </Toolbar>
    </TableHead>
  );
}
