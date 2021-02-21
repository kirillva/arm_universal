import { MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";

export const SelectSubdivision = ({
  value,
  error,
  handleChange,
  isSubmitting,
  margin = "dense",
  size = "medium",
  name,
}) => {
  const [subdivisions, setSubdivisions] = useState([]);

  useEffect(() => {
    runRpc({
      action: "sd_subdivisions",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "n_code", direction: "asc" }],
          filter: [{ property: "id", value: 0, operator: "gt" }],
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setSubdivisions(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TextField
      select
      margin={margin}
      size={size}
      label="Округ ЧГСД"
      name={name}
      value={value}
      error={error}
      helperText={error}
      onChange={handleChange}
      disabled={isSubmitting}
      variant="outlined"
    >
      <MenuItem value={null}>Не выбрано</MenuItem>
      {subdivisions.map((item) => (
        <MenuItem value={item.id}>{item.c_name}</MenuItem>
      ))}
    </TextField>
  );
};
