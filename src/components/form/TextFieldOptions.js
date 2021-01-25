import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { AddNewField } from "./AddNewField";
import { Add, ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { getElementByBreadcrumbs } from "components/reduxForm/ReduxFormHelpers";

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

const disabledProps = ["items"];

export const TextFieldOptions = () => {
  const classes = useStyles();

  const { form, breadcrumbs } = useSelector((state) => state.reduxForm);

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
    if (form && breadcrumbs) {
      setSelectedItem(getElementByBreadcrumbs(form, breadcrumbs));
    } else {
      setSelectedItem(null);
    }
  }, [form, breadcrumbs]);

  const moveUp = () => {
    const _breadcrumbs = _.clone(breadcrumbs);
    const value = _breadcrumbs[breadcrumbs.length - 1];
    if (value - 1 >= 0) {
      _breadcrumbs[_breadcrumbs.length - 1] = value - 1;
      dispatch({
        type: 'reduxForm/moveElement',
        breadcrumbs: _breadcrumbs,
      })
    }

  }

  const moveDown = () => {
    const _breadcrumbs = _.clone(breadcrumbs);
    const value = _breadcrumbs[_breadcrumbs.length - 1];

    const _containerBreadcrumbs = _.clone(breadcrumbs).splice(breadcrumbs.length - 1, 1);
    const element = getElementByBreadcrumbs(form, _containerBreadcrumbs);

    if (value + 1 < element.items.length) {
      _breadcrumbs[_breadcrumbs.length - 1] = value + 1;
      dispatch({
        type: 'reduxForm/moveElement',
        breadcrumbs: _breadcrumbs,
      })
    }
  }

  if (!selectedItem) return null;

  return (
    <div className={classes.optionsContainer}>
      {_.uniqBy(Object.keys(selectedItem).concat(keys))
        .filter((item) => !(disabledProps.indexOf(item) + 1))
        .map((key) => {
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
          onClick={moveUp}
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
          onClick={moveDown}
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
            type: "reduxForm/updateByBreadcrumbs",
            selectedItem,
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
            type: "reduxForm/setBreadcrumbs",
            breadcrumbs: [],
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
            type: "reduxForm/setBreadcrumbs",
            breadcrumbs: [],
          });
        }}
      >
        Отменить
      </Button>
    </div>
  );
};
