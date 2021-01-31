import React, { useState } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import _ from "lodash";
import DatePicker from "./DatePicker";
import Hidden from '@material-ui/core/Hidden';

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

export const NumberFilter = ({
  column: { filterValue, setFilter },
  className,
  allowNegative = true,
  hidden
}) => {
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
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
      style={{ display: hidden ? 'none' : 'unset'}}
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
  hidden
}) => {
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
  return (
    <TextField
      style={{ display: hidden ? 'none' : 'unset'}}
      variant="outlined"
      margin="dense"
      value={value}
      className={className}
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
  className
}) => {
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
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
  hidden
}) => {
  return (
    <DatePicker
      style={{ display: hidden ? 'none' : 'unset'}}
      value={filterValue}
      className={className}
      onChange={(props) => {
        setFilter({ ...filterValue, ...props, operator: Operators.date })
      }}
      initialDateStart={filterValue.start}
      initialDateFinish={filterValue.finish}
    />
  );
};

export const BoolFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden
}) => {
  const defaultProps = {
    BOOL_TRUE: "Да",
    BOOL_FALSE: "Нет",
  };

  return (
    <TextField
      select
      style={{ display: hidden ? 'none' : 'unset'}}
      value={filterValue ? filterValue.value : ""}
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