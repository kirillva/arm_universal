import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import _ from "lodash";
import Hidden from "@material-ui/core/Hidden";
import { Clear } from "@material-ui/icons";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePicker
} from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import BaseDatePicker from "components/BaseDatePicker";
import BaseNumberFromToFilter from "components/BaseNumberFilter";
const useStyles = makeStyles((theme) => ({
  adornedEnd: {
    paddingRight: "3px",
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
  fromTo: "fromTo",
  fromToNumber: "fromToNumber",
};

function applyFilter(filterValue, value, setFilter) {
  if (!filterValue || value !== filterValue) {
    setFilter(value);
    // if (value) {
    // } else {
    //   setFilter(null);
    // }
  }
}

const applyFilterDebounced = _.debounce(applyFilter, 1000);

export const NumberFilter = ({
  column: { filterValue, setFilter },
  className,
  allowNegative = true,
  hidden,
}) => {
  const [value, setValue] = useState(filterValue);
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
      placeholder="Поиск..."
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
          applyFilterDebounced(filterValue, e.target.value, setFilter);
        }
      }}
      onKeyDown={(e) => {
        if (!error) {
          if (e.key === "Enter") {
            applyFilter(filterValue, e.target.value, setFilter);
            applyFilterDebounced.cancel();
          }
        }
      }}
    />
  );
};

export const DateSingleFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden,
}) => {
  const classes = useStyles();
  return (
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale={"ru"}
    >
      <DatePicker
        autoOk
        placeholder="Поиск..."
        inputVariant="outlined"
        format={"DD.MM.YYYY"}
        value={filterValue || null}
        size="small"
        onChange={(date) => setFilter(date)}
        clearable={true}
        clearLabel={'Сбросить'}
        okLabel={'Ок'}
        cancelLabel={'Отмена'}
       
      />
    </MuiPickersUtilsProvider>
  );
};

export const FromToFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden,
}) => {
  // const classes = useStyles();
  const [from, setFrom] = useState(filterValue ? filterValue.from : "");
  const [to, setTo] = useState(filterValue ? filterValue.to : "");

  return (
    <>
      <TextField
        type="text"
        style={{ display: hidden ? "none" : "unset" }}
        variant="outlined"
        margin="dense"
        value={from}
        className={className}
        onChange={(e) => {
          setFrom(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            applyFilter(filterValue, e.target.value, setFilter);
            applyFilterDebounced.cancel();
          }
        }}
      />
      <TextField
        type="text"
        style={{ display: hidden ? "none" : "unset" }}
        variant="outlined"
        margin="dense"
        value={to}
        className={className}
        onChange={(e) => {
          setTo(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            applyFilter(filterValue, e.target.value, setFilter);
            applyFilterDebounced.cancel();
          }
        }}
      />
    </>
  );
};

export const StringFilter = ({
  column: { filterValue, setFilter },
  className,
  hidden,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(filterValue);
  return (
    <TextField
      placeholder="Поиск..."
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
        applyFilterDebounced(filterValue, e.target.value, setFilter);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          applyFilter(filterValue, e.target.value, setFilter);
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
  const [value, setValue] = useState(filterValue);
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
          applyFilter(filterValue, e.target.value, setFilter);
          applyFilterDebounced.cancel();
        }
      }}
    />
  );
};
export const NumberFromToFilter = ({ column: { filterValue = { start: null, finish: null }, setFilter }, className }) => {
	return (
		<BaseNumberFromToFilter
			value={filterValue}
			className={className}
			// InputProps={{
			// 	className: styles.DateFilter
			// }}
			onChange={props => setFilter({ ...filterValue, ...props, operator: Operators.fromToNumber })}
			initialStart={filterValue.start}
			initialFinish={filterValue.finish}
		/>
	);
};

export const DateFilter = ({ column: { filterValue = { start: null, finish: null }, setFilter }, className }) => {
	return (
		<BaseDatePicker
			value={filterValue}
			className={className}
			// InputProps={{
			// 	className: styles.DateFilter
			// }}
			onChange={props => setFilter({ ...filterValue, ...props, operator: Operators.date })}
			initialDateStart={filterValue.start}
			initialDateFinish={filterValue.finish}
		/>
	);
};

export const BoolFilter = ({ column, className, hidden, props = {} }) => {
  const defaultProps = {
    BOOL_TRUE: "Да",
    BOOL_FALSE: "Нет",
  };
  const { filterValue, setFilter, id } = column;
  return (
    <TextField
      select
      fullWidth
      style={{ display: hidden ? "none" : "unset" }}
      value={filterValue}
      variant="outlined"
      margin="dense"
      name={column.id}
      className={className}
      onChange={(e) => {
        setFilter(e.target.value);
      }}
    >
      <MenuItem value={""}>Все</MenuItem>
      <MenuItem value={"true"}>
        {props.BOOL_TRUE || defaultProps.BOOL_TRUE}
      </MenuItem>
      <MenuItem value={"false"}>
        {props.BOOL_FALSE || defaultProps.BOOL_FALSE}
      </MenuItem>
    </TextField>
  );
};
