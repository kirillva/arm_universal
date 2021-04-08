import { MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import { getItem } from "utils/user";

export const SelectUik = ({
  subdivision,
  division,
  value,
  error,
  handleChange,
  isSubmitting,
  margin = "dense",
  size = "medium",
  name,
  className,
}) => {
  const [uik, setUik] = useState([]);

  const login = getItem("login");

  useEffect(() => {
    const filter = [];
    if (subdivision) {
      filter.push({
        property: "f_subdivision",
        value: subdivision,
        operator: "=",
      });
    }
    if (division) {
      filter.push({
        property: "f_division",
        value: division,
        operator: "=",
      });
    }
    runRpc({
      action: login === "nov" ? "cv_uik_tmp_nov_ref" : "cv_uik_ref",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "f_uik", direction: "asc" }],
          filter: filter,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setUik(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, subdivision]);

  return (
    <TextField
      className={className}
      select
      margin={margin}
      size={size}
      label="УИК"
      name={name}
      value={value}
      error={error}
      helperText={error}
      onChange={handleChange}
      disabled={isSubmitting}
      variant="outlined"
    >
      <MenuItem value={null}>Не выбрано</MenuItem>
      {uik.map((item) => (
        <MenuItem key={item.f_uik} value={item.f_uik}>
          {item.f_uik} ({item.c_subdivision})
        </MenuItem>
      ))}
    </TextField>
  );
};
