import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { BoolEditor } from "components/table/Editors";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  formWrapper: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    minWidth: 300,
  },
  title: {
    textAlign: "center",
  },
}));

export const EditStreet = ({ id, refreshPage }) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setValues,
    errors,
  } = useFormik({
    initialValues: {
      id: id,
      c_name: "",
      c_type: "",
      c_short_type: "",
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_street",
        method: "Update",
        data: [{ ...values, f_user: getUserId() }],
        type: "rpc",
      }).then((responce) => {
        refreshPage();
        setSubmitting(false);
        console.log(responce.result.records);
      });
      console.log({ ...values, f_user: getUserId() });
    },
  });

  useEffect(() => {
    runRpc({
      action: "cs_street",
      method: "Query",
      data: [
        {
          filter: [
            {
              property: "id",
              value: id,
              operator: "=",
            },
          ],
          limit: 1,
        },
      ],
      type: "rpc",
    }).then(responce=>{
      setValues(responce.result.records[0]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Изменить улицу
        </Typography>
        <TextField
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
          error={errors.c_name}
          helperText={errors.c_name}
          label="Название"
          name="c_name"
          value={values.c_name}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <BoolEditor
          error={errors.b_disabled}
          helperText={errors.b_disabled}
          label="Выключено"
          name="b_disabled"
          value={values.b_disabled}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
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
