import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getItem, getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { BoolEditor } from "components/table/Editors";
import { GetGUID } from "utils/helpers";
import { AddStreet } from "./AddStreet";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  formWrapper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    // minWidth: 300,
  },
  title: {
    textAlign: "center",
  },
  fieldWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

export const EditStreet = ({
  id,
  validate = () => {},
  refreshPage,
  street,
  enableDelete = false,
}) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setValues,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: {
      id: id,
      c_name: "",
      c_type: "",
      c_short_type: "",
      b_disabled: false,
    },
    onSubmit: (values) => {
      validate(values.c_name, () => {
        return (success) => {
          if (success) {
            runRpc({
              action: "cs_street",
              method: "Update",
              data: [{ ...values, f_user: getUserId() }],
              type: "rpc",
            }).then((responce) => {
              refreshPage();
              setSubmitting(false);
            });
          } else {
            setSubmitting(false);
          }
        };
      });
    },
  });

  useEffect(() => {
    street && setValues(street);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street]);

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Изменить улицу
        </Typography>
        <div className={classes.fieldWrapper}>
          <TextField
            size="small"
            margin="none"
            error={errors.c_type}
            helperText={errors.c_type}
            label="Тип"
            name="c_type"
            value={values.c_type}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          <TextField
            size="small"
            margin="none"
            error={errors.c_short_type}
            helperText={errors.c_short_type}
            label="Краткий тип"
            name="c_short_type"
            value={values.c_short_type}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          <TextField
            size="small"
            margin="none"
            error={errors.c_name}
            helperText={errors.c_name}
            label="Название"
            name="c_name"
            value={values.c_name}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          {enableDelete ? (
            <BoolEditor
              size="small"
              margin="none"
              error={errors.b_disabled}
              helperText={errors.b_disabled}
              label="Активна"
              name="b_disabled"
              value={!values.b_disabled}
              onChange={(e) => setFieldValue(e.target.name, !e.target.value)}
              disabled={isSubmitting}
              variant="outlined"
            />
          ) : null}
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Сохранить
        </Button>
      </form>
    </Paper>
  );
};

export const useStreet = (props) => {
  const { onSave = () => {}, enableDelete = false } = props || {};
  const [street, setStreet] = useState(null);
  const [id, setId] = useState(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const [foundStreets, setFoundStreets] = useState([]);
  const [func, setFunc] = useState(null);
  const [name, setName] = useState("");

  const login = getItem("login");

  const loadFoundData = (name, callback) => {
    const filter = [
      {
        property: "c_name",
        value: name,
        operator: "like",
      },
    ];
    if (id && id !== "new") {
      filter.push({
        property: "id",
        value: id,
        operator: "<>",
      });
    }
    if (login == "nov") {
      filter.push({
        property: "f_main_division",
        value: 10,
        operator: "=",
      });
    } else {
      filter.push({
        property: "f_main_division",
        value: 10,
        operator: "<>",
      });
    }
    runRpc({
      action: "cs_street",
      method: "Query",
      data: [
        {
          limit: 1000,
          filter,
        },
      ],
      type: "rpc",
    }).then((response) => {
      const records = response.result.records;
      callback(records);
    });
  };

  const validateStreet = async (_name = "", _func) => {
    if (_name) {
      setName(_name);
      loadFoundData(_name, (records) => {
        setFoundStreets(records);
        if (records && records.length) {
          setWindowOpen(true);
          setFunc(_func);
        } else {
          _func()(true);
        }
      })
    } else {
      _func()(false);
    }
  };

  const loadData = (_id) => {
    runRpc({
      action: "cs_street",
      method: "Query",
      data: [
        {
          limit: 1000,
          filter: [
            {
              property: "id",
              value: _id,
              operator: "=",
            },
          ],
        },
      ],
      type: "rpc",
    }).then((responce) => {
      responce && setStreet(responce.result.records[0]);
    });
  };

  const toggleState = (id, value) => {
    runRpc({
      action: "cs_street",
      method: "Update",
      data: [{ b_disabled: !Boolean(value), id: id }],
      type: "rpc",
    }).then(() => {
      loadFoundData(name, (records) => {
        setFoundStreets(records);
      });
    });
  };

  useEffect(() => {
    if (id && id != "new") {
      loadData(id);
    }
  }, [id]);

  const handleSave = () => {
    onSave();
  };

  const onClose = () => {
    setWindowOpen(false);
    func(false);
    setFunc(null);
  };

  return {
    openStreet: (id) => {
      setId(id);
      loadData(id);
    },
    addStreet: () => {
      setId("new");
    },
    component: (
      <>
        <Dialog open={windowOpen} onClose={onClose}>
          <DialogTitle>Возможные дубликаты:</DialogTitle>
          <DialogContent>
            {foundStreets.map((item) => {
              return (
                <Box marginBottom="16px" display={"flex"} alignItems={"center"}>
                  <Box marginRight="16px">
                    <Typography>
                      {item.c_short_type} {item.c_name}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleState(item.id, item.b_disabled)}
                  >
                    {item.b_disabled ? "Активировать" : "Деактивировать"}{" "}
                  </Button>
                </Box>
              );
            })}
            <Typography>Активация/деактивация других улиц происходит сразу, сохранить и отмена относятся к изменениям текущей выбранной улицы</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant={"contained"}
              color="primary"
              onClick={() => {
                if (func) {
                  setWindowOpen(false);
                  func(true);
                  setFunc(null);
                }
              }}
            >
              Сохранить
            </Button>
            <Button onClick={onClose}>Отмена</Button>
          </DialogActions>
        </Dialog>
        {id === "new" ? (
          <AddStreet validate={validateStreet} refreshPage={handleSave} />
        ) : (
          <EditStreet
            validate={validateStreet}
            enableDelete={enableDelete}
            id={id}
            refreshPage={handleSave}
            street={street}
          />
        )}
      </>
    ),
  };
};
