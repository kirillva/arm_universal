import { MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";

export const SelectVoterType = ({
  value,
  error,
  handleChange,
  isSubmitting,
  margin = "dense",
  size = "medium",
  name,
  className
}) => {
  const [voterType, setVoterType] = useState([]);

  useEffect(() => {
    const filter = [{
      property: "b_disabled",
      value: false,
      operator: "=",
    }];
    
    runRpc({
      action: "cs_people_types",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "c_name", direction: "asc" }],
          filter: filter,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setVoterType(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TextField
      className={className}
      select
      margin={margin}
      size={size}
      label="Тип избирателя"
      name={name}
      value={value}
      error={error}
      helperText={error}
      onChange={handleChange}
      disabled={isSubmitting}
      variant="outlined"
    >
      <MenuItem value={null}>Не выбрано</MenuItem>
      {voterType.map((item) => (
        <MenuItem key={item.id} value={item.id}>{item.c_name}</MenuItem>
      ))}
    </TextField>
  );
};
