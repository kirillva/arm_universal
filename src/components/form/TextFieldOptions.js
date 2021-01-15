import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const TextFieldOptions = () => {
  const classes = useStyles();

  const { form, containerId, componentId } = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);

  const onChange = (name) => {
    return (e) => {
      setSelectedItem({ ...selectedItem, [name]: e.target.value });
    };
  };

  useEffect(() => {
    if (containerId && componentId !== null && form[containerId].items) {
      setSelectedItem(_.cloneDeep(form[containerId].items[componentId]));
    }
  }, [form, containerId, componentId]);

  if (!selectedItem) return null;

  return (
    <div className={classes.optionsContainer}>
      <TextField
        name={"fieldLabel"}
        onChange={onChange("fieldLabel")}
        label={"fieldLabel"}
        value={selectedItem.fieldLabel || ""}
        variant="outlined"
      />
      <TextField
        name={"margin"}
        onChange={onChange("margin")}
        label={"margin"}
        value={selectedItem.margin || ""}
        variant="outlined"
      />

      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          dispatch({
            type: "form/updateSelectedComponent",
            props: selectedItem,
          });
        }}
      >
        Сохранить
      </Button>
      <Button color="secondary" variant="contained">
        Отменить
      </Button>
    </div>
  );
};
