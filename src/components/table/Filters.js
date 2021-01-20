import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@material-ui/core";
// import BaseDatePicker from 'base/components/ReactTable/BaseDatePicker';
import { runRpc } from "utils/rpc";
// import defaultProps from './DefaultProps';
// import styles from './Filter.module.css';
import _ from "lodash";
import DatePicker from "./DatePicker";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import useQueryRegistry from 'hooks/useQueryRegistry';

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
  const InputProps = {
    // className: styles.baseField
  };

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
      InputProps={
        {
          // className: styles.baseField
        }
      }
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

// export const SelectFilter = ({
//   column: { filterValue, setFilter },
//   className,
//   table = "",
// }) => {
//   const [value, setValue] = useState(filterValue ? filterValue.value : "");
//   const [options, setOptions] = useState([]);

//   const loadData = () => {

//   }
	
//   const applyLoadDataDebounced = _.debounce(loadData, 1000);
// //   console.log("table", table);
//   return (
//     <Autocomplete
//       options={options}
//       getOptionLabel={(option) => option.title}
//     //   style={{ width: 300 }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           margin="dense"
//           value={value}
//           className={className}
//         //   InputProps={
//         //     {
//         //       // className: styles.baseField
//         //     }
//         //   }
//           onChange={(e) => {
//             setValue(e.target.value);
//             applyLoadDataDebounced(filterValue, e.target.value, setFilter, "=");
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//             //   applyFilter(filterValue, e.target.value, setFilter, "=");
//               applyLoadDataDebounced.cancel();
//             }
//           }}
//         />
//       )}
//     />
//   );
// };

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
      InputProps={
        {
          // className: styles.baseField
        }
      }
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
      // InputProps={{
      // 	className: styles.DateFilter
      // }}
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
      // InputProps={{
      // 	className: styles.baseField
      // }}
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

export const StatusFilter = ({
  column: { filterValue, setFilter },
  className,
}) => {
  const [statuses, setStatuses] = useState([]);
  useEffect(() => {
    runRpc({
      action: "cs_route_statuses",
      method: "Query",
      data: [
        {
          limit: 10000,
          filter: [
            {
              property: "b_disabled",
              value: false,
              operator: "is",
            },
          ],
        },
      ],
      type: "rpc",
    }).then((response) => {
      setStatuses(response.result.records);
    });
  }, []);
  return (
    <TextField
      select
      value={filterValue ? filterValue.value : ""}
      variant="outlined"
      margin="dense"
      className={className}
      // InputProps={{
      // 	className: styles.baseField
      // }}
      onChange={(e) => {
        console.log(" e.target.value", e.target.value);
        console.log("filterValue", filterValue);
        setFilter({ value: e.target.value, operator: Operators.status });
      }}
    >
      <MenuItem value={""}>Все</MenuItem>
      {statuses.map((el, index) => {
        return (
          <MenuItem key={index} value={el.c_name}>
            {el.c_name}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

// export const RegistryFilter = (props) => {
// 	const { column: { regAccessor, reg, regItemMapper, regOperator = Operators.number }, state, setFilter, className } = props;

// 	const { registry } = useQueryRegistry(reg);

// 	const filter = useMemo(() => {
// 		return state.filters.find((item) => item.id === regAccessor);
// 	}, [state.filters]);

// 	const menuItems = useMemo(() => {
// 		return registry.map((item) => regItemMapper(item));
// 	}, [registry]);

// 	return (
// 		<TextField
// 			select
// 			value={filter ? filter.value.value : ''}
// 			variant="outlined"
// 			margin="dense"
// 			className={className}
// 			InputProps={{
// 				className: styles.baseField
// 			}}
// 			disabled={menuItems.length === 0}
// 			onChange={e => {
// 				setFilter(regAccessor, { value: `${e.target.value}`, operator: regOperator });
// 			}}
// 		>
// 			<MenuItem id='' value=''>Все</MenuItem>
// 			{menuItems.map((item, index) => {
// 				return (
// 					<MenuItem key={item.id} value={item.value}>
// 						{item.description}
// 					</MenuItem>
// 				);
// 			})}
// 		</TextField>
// 	);
// }
