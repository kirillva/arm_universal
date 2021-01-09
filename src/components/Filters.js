import React, { useState } from "react";
import { TextField, MenuItem, makeStyles } from "@material-ui/core";
// import BaseDatePicker from "base/components/ReactTable/BaseDatePicker";
import defaultProps from "./DefaultProps";
// import styles from "./Filter.module.css";

const useStyles = makeStyles((theme) => ({
  baseField: {

  }
}));


export const Operators = {
  number: "number",
  string: "string",
  date: "date",
  bool: "bool",
  isNull: "isNull"
};

export const NumberFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
  return (
    <TextField
      onChange={(e) => {
        setValue(e.target.value);
        if (!filterValue || e.target.value !== filterValue.value) {
          setFilter({ value: e.target.value, operator: Operators.number });
        }
      }}
      type="number"
      variant="outlined"
      margin="dense"
      value={value}
      className={className}
      InputProps={{
        className: classes.baseField,
      }}
      // onChange={e => setValue(e.target.value)}
    />
  );
};

export const StringFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
  return (
    <TextField
      onChange={(e) => {
        setValue(e.target.value);
        if (!filterValue || e.target.value !== filterValue.value) {
          setFilter({ value: e.target.value, operator: Operators.string });
        }
      }}
      variant="outlined"
      margin="dense"
      value={value}
      className={className}
      InputProps={{
        className: classes.baseField,
      }}
      // onChange={(e) => setValue(e.target.value)}
    />
  );
};

// export const DateFilter = ({
//   column: { filterValue = { start: null, finish: null }, setFilter },
//   className,
// }) => {
//   const classes = useStyles();
//   return (
//     <BaseDatePicker
//       value={filterValue}
//       className={className}
//       InputProps={{
//         className: classes.baseField,
//       }}
//       onChange={(props) =>
//         setFilter({ ...filterValue, ...props, operator: Operators.date })
//       }
//     />
//   );
// };

export const BoolFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const classes = useStyles();
  return (
    <TextField
      select
      value={filterValue ? filterValue.value : ""}
      variant="outlined"
      margin="dense"
      className={className}
      InputProps={{
        className: classes.baseField,
      }}
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


export const IsNullFilter = ({ column: { filterValue, setFilter }, className }) => {
  const classes = useStyles();
  return (
    <TextField
      select
      value={filterValue ? filterValue.value : ""}
      variant="outlined"
      margin="dense"
      className={className}
      InputProps={{
        className: classes.baseField,
      }}
      onChange={(e) =>
        setFilter({ value: e.target.value, operator: Operators.isNull, })
      }
    >
      <MenuItem value={""}>Все</MenuItem>
      <MenuItem value={true}>Есть</MenuItem>
      <MenuItem value={false}>Нет</MenuItem>
    </TextField>
  );
};