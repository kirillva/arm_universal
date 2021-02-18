import React from "react";
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
import * as Yup from 'yup';

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

export const AddStreet = ({ refreshPage }) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    errors,
  } = useFormik({
    validateOnBlur: true,
    validationSchema:  Yup.object().shape({
      c_name: Yup.string().required('Не заполнено обязательное поле'),
    }),
    initialValues: {
      c_name: "",
      c_type: "",
      c_short_type: "",
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_street",
        method: "Add",
        data: [{ ...values, f_user: getUserId(), b_disabled: false }],
        type: "rpc",
      }).then((responce) => {
        refreshPage();
        setSubmitting(false);
      });
    },
  });
  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Добавить улицу
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
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Добавить
        </Button>
      </form>
    </Paper>
  );
};
