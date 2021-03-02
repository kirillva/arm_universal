import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import _ from "lodash";
import DatePicker from "./DatePicker";
import Hidden from "@material-ui/core/Hidden";
import { Clear } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  adornedEnd: {
    paddingRight: '3px',
  },
  root: {
    padding: "6px",
  },
}));

export const Operators = {
  number: "number",
  string: "string",
  date: "date",
  bool: "bool",
  user: "user",
  status: "status",
};

function applyFilter(filterValue, value, setFilter, operator) {
  if (!filterValue || value !== filterValue.value) {
    if (value) {
      setFilter({ value, operator });
    } else {
      setFilter(null);
    }
  }
}

const applyFilterDebounced = _.debounce(applyFilter, 1000);

function getFilterValue (filterValue) {
  if (filterValue && filterValue.value) {
    return filterValue.value
  }
  if (filterValue && !filterValue.value) {
    return filterValue
  }
  return "";
}

export const NumberFilter = ({
  column: { filterValue, setFilter },
  className,
  allowNegative = true,
  hidden,
}) => {
  const [value, setValue] = useState(getFilterValue(filterValue));
  const InputProps = {};

  const inputProps = {};
  if (!allowNegative) {
    inputProps.min = "0";
  }

  const error =
    !allowNegative && Number(value) < 0
      ? "Значение не может быть отрицательным"
      : "";

  return (
    <TextField
      type="number"
      style={{ display: hidden ? "none" : "unset" }}
      variant="outlined"
      margin="dense"
      value={value}
      error={error}
      className={className}
      InputProps={InputProps}
      inputProps={inputProps}
      onChange={(e) => {
        setValue(e.target.value);
        if (!error) {
          applyFilterDebounced(
            filterValue,
            e.target.value,
            setFilter,
            Operators.number
          );
        }
      }}
      onKeyDown={(e) => {
        if (!error) {
          if (e.key === "Enter") {
            applyFilter(
              filterValue,
              e.target.value,
              setFilter,
              Operators.number
            );
            applyFilterDebounced.cancel();
          }
        }
      }}
    />
  );
};

export const StringFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(getFilterValue(filterValue));
  return (
    <TextField
      fullWidth
      style={{ display: hidden ? "none" : "unset" }}
      variant="outlined"
      margin="dense"
      value={value}
      className={className}
      InputProps={{
        classes: {
          adornedEnd: classes.adornedEnd,
        },
        endAdornment: (
          <IconButton
            classes={{
              root: classes.root,
            }}
            onClick={() => {
              setValue("");
              setFilter(null);
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        ),
      }}
      onChange={(e) => {
        setValue(e.target.value);
        applyFilterDebounced(filterValue, e.target.value, setFilter, "like");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          applyFilter(filterValue, e.target.value, setFilter, "like");
          applyFilterDebounced.cancel();
        }
      }}
    />
  );
};

export const UserFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const [value, setValue] = useState(getFilterValue(filterValue));
  return (
    <TextField
      disabled
      variant="outlined"
      margin="dense"
      value={value}
      className={className}
      onChange={(e) => {
        setValue(e.target.value);
        applyFilterDebounced(
          filterValue,
          e.target.value,
          setFilter,
          Operators.user
        );
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          applyFilter(filterValue, e.target.value, setFilter, Operators.user);
          applyFilterDebounced.cancel();
        }
      }}
    />
  );
};

export const DateFilter = ({
  column: { filterValue = { start: null, finish: null }, setFilter },
  className,
  hidden,
}) => {
  return (
    <DatePicker
      style={{ display: hidden ? "none" : "unset" }}
      value={filterValue}
      className={className}
      onChange={(props) => {
        setFilter({ ...filterValue, ...props, operator: Operators.date });
      }}
      initialDateStart={filterValue.start}
      initialDateFinish={filterValue.finish}
    />
  );
};

export const BoolFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden,
}) => {
  const defaultProps = {
    BOOL_TRUE: "Да",
    BOOL_FALSE: "Нет",
  };

  return (
    <TextField
      select
      fullWidth
      style={{ display: hidden ? "none" : "unset" }}
      value={getFilterValue(filterValue)}
      variant="outlined"
      margin="dense"
      className={className}
      onChange={(e) =>
        setFilter({ value: e.target.value, operator: Operators.bool })
      }
    >
      <MenuItem value={""}>Все</MenuItem>
      <MenuItem value={true}>{defaultProps.BOOL_TRUE}</MenuItem>
      <MenuItem value={false}>{defaultProps.BOOL_FALSE}</MenuItem>
    </TextField>
  );
};
