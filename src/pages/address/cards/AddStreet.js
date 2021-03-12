import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getUserId, getItem } from "utils/user";
import { runRpc } from "utils/rpc";
import * as Yup from "yup";
// import { useHistory, useRouteMatch } from "react-router-dom";
import { GetGUID } from "utils/helpers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  formWrapper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: 300,
  },
  title: {
    textAlign: "center",
  },
  fieldWrapper: {
    display: "grid",
    gap: theme.spacing(1),
    gridTemplateColumns: "1fr 1fr",
  },
  houseName: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }
}));

export const AddStreet = ({ refreshPage }) => {
  // const history = useHistory();
  const initialValues = {
    id: GetGUID(),
    c_name: "",
    c_type: "",
    c_short_type: "",
  };
  const login = getItem("login");
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingRecords, setExistingRecords] = useState([]);

  async function loadExistingRecords(_values) {
    const { c_name } = _values;
    const exist = await runRpc({
      action: "cs_street",
      method: "Query",
      data: [
        {
          filter: [{
            property: 'c_name',
            operator: 'like',
            value: c_name
          }],
          limit: 10000,
        },
      ],
      type: "rpc",
    });
    if (exist && exist.result.records.length) {
      return exist.result.records;
    } else return []
  }

  const saveValues = async (values) => {
    const responce = await runRpc({
      action: "cs_street",
      method: "Add",
      data: [
        {
          ...values,
          f_user: getUserId(),
          b_disabled: false,
          f_main_division: login === "nov" ? 10 : null,
        },
      ],
      type: "rpc",
    });
    return responce;
  };


  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    submitForm,
    // validateForm,
    errors,
    isValid,
  } = useFormik({
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      c_name: Yup.string().required("Не заполнено обязательное поле"),
    }),
    initialValues,
    onSubmit: async (values) => {
      const exist = await loadExistingRecords(values);
      setExistingRecords(exist);
      let responce = [];
      if (exist && exist.length) {
        setOpen(true);
      } else {
        setOpen(false);
        responce = await saveValues(values);
        refreshPage(values.id);
      }
      setSubmitting(false);
      return responce;
    },
  });

  // const onSubmitAndEdit = () => {
  //   submitForm()
  //   // .then((responce) => {
  //   //   if (responce) {
  //   //     history.push(`${match.path}/${values.id}`);
  //   //   }
  //   // });
  // };

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Добавление</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography>Уже существуют следующие улицы:</Typography>
          {existingRecords.map((item) => {
            const { c_type, c_name, id, b_disabled } = item;
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Typography className={classes.houseName}>
                  {c_type} {c_name}
                </Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    runRpc({
                      action: "cs_street",
                      method: "Update",
                      data: [
                        {
                          id,
                          b_disabled: !b_disabled,
                        },
                      ],
                      type: "rpc",
                    }).then(() => {
                      loadExistingRecords(values).then(records=>{
                        setExistingRecords(records);
                      });
                    });
                  }}
                >
                  {b_disabled ? "Включить" : "Выключить"}
                </Button>
              </Box>
            );
          })}
          <Typography>Вы действительно хотите добавить улицу?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            color="primary"
            variant="contained"
            onClick={() => {
              setLoading(true);
              saveValues(values)
                .then(() => {
                  setOpen(false);
                  setLoading(false);
                })
                .finally(() => {
                  setLoading(false);
                  refreshPage(values.id);
                });
            }}
          >
            Добавить
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setOpen(false);
            }}
          >
            Отменить
          </Button>
        </DialogActions>
      </Dialog>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Добавить улицу
        </Typography>
        <div className={classes.fieldWrapper}>
          <TextField
            margin={"none"}
            size={"small"}
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
            margin={"none"}
            size={"small"}
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
            margin={"none"}
            size={"small"}
            error={errors.c_name}
            helperText={errors.c_name}
            label="Название"
            name="c_name"
            value={values.c_name}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Добавить
        </Button>
        {/* <Button
          onClick={onSubmitAndEdit}
          color="primary"
          variant="outlined"
          disabled={isSubmitting}
        >
          Добавить и редактировать улицу
        </Button> */}
      </form>
    </Paper>
  );
};
