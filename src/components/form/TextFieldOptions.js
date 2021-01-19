import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { AddNewField } from "./AddNewField";
import { Add, ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
  },
  buttonAdd: {
    margin: "auto",
  },
}));

const initialState = ["xtype", "fieldLabel", "name", "margin"];

export const TextFieldOptions = () => {
  const classes = useStyles();

  const { form, containerId, componentId } = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState(initialState);

  const onChange = (name) => {
    return (e) => {
      setSelectedItem({ ...selectedItem, [name]: e.target.value });
    };
  };

  useEffect(() => {
    setKeys(initialState);
    if (containerId && componentId !== null && form[containerId].items) {
      setSelectedItem(_.cloneDeep(form[containerId].items[componentId]));
    } else {
      setSelectedItem(null);
    }
  }, [form, containerId, componentId]);

  if (!selectedItem) return null;

  return (
    <div className={classes.optionsContainer}>
      {_.uniqBy(Object.keys(selectedItem).concat(keys)).map((key) => {
        return (
          <TextField
            key={key}
            name={key}
            onChange={onChange(key)}
            label={key}
            value={selectedItem[key] || ""}
            variant="outlined"
          />
        );
      })}

      <div className={classes.buttons}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            dispatch({
              type: "form/changeComponentOrder",
              toStart: true
            })
          }
        >
          <ArrowDropUp />
        </Button>
        <Button
          className={classes.buttonAdd}
          variant="outlined"
          color="primary"
          onClick={() => setOpen(!open)}
        >
          <Add />
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            dispatch({
              type: "form/changeComponentOrder",
              toStart: false
            })
          }
        >
          <ArrowDropDown />
        </Button>
      </div>

      <AddNewField
        keys={keys}
        setKeys={setKeys}
        open={open}
        onClose={() => setOpen(false)}
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
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          dispatch({
            type: "form/removeComponent"
          });
        }}
      >
        Удалить
      </Button>
      
      <Button
        color="secondary"
        variant="contained"
        onClick={() => {
          dispatch({
            type: "form/setSelectedComponent",
            containerId: null,
            componentId: null,
          });
        }}
      >
        Отменить
      </Button>
    </div>
  );
};
