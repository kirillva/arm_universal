import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { runRpc } from "utils/rpc";
import _ from "lodash";
import DatePicker from "./DatePicker";

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
}) => {
  const [value, setValue] = useState(filterValue ? filterValue.value : "");
  return (
    <TextField
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
  className,
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
}) => {
  return (
    <DatePicker
      value={filterValue}
      className={className}
      onChange={(props) =>
        setFilter({ ...filterValue, ...props, operator: Operators.date })
      }
      initialDateStart={filterValue.start}
      initialDateFinish={filterValue.finish}
    />
  );
};

export const BoolFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const defaultProps = {
    BOOL_TRUE: "Да",
    BOOL_FALSE: "Нет",
  };

  return (
    <TextField
      select
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

// export const StatusFilter = ({
//   column: { filterValue, setFilter },
//   className,
// }) => {
//   const [statuses, setStatuses] = useState([]);
//   useEffect(() => {
//     runRpc({
//       action: "cs_route_statuses",
//       method: "Query",
//       data: [
//         {
//           limit: 10000,
//           filter: [
//             {
//               property: "b_disabled",
//               value: false,
//               operator: "is",
//             },
//           ],
//         },
//       ],
//       type: "rpc",
//     }).then((response) => {
//       setStatuses(response.result.records);
//     });
//   }, []);
//   return (
//     <TextField
//       select
//       value={filterValue ? filterValue.value : ""}
//       variant="outlined"
//       margin="dense"
//       className={className}
//       onChange={(e) => {
//         console.log(" e.target.value", e.target.value);
//         console.log("filterValue", filterValue);
//         setFilter({ value: e.target.value, operator: Operators.status });
//       }}
//     >
//       <MenuItem value={""}>Все</MenuItem>
//       {statuses.map((el, index) => {
//         return (
//           <MenuItem key={index} value={el.c_name}>
//             {el.c_name}
//           </MenuItem>
//         );
//       })}
//     </TextField>
//   );
// };
