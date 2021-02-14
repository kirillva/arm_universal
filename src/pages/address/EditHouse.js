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
import { BoolEditor, SelectEditor } from "components/table/Editors";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
  },
  formWrapper: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    minidth: 300,
  },
  title: {
    textAlign: "center",
  },
}));

export const EditHouse = ({ id, refreshPage }) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldValue,
    errors,
  } = useFormik({
    initialValues: {
      id: id,
      c_house_number: '',
      c_house_corp: '',
      n_uik: '',
      f_subdivision: null,
      b_disabled: false,
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_house",
        method: "Update",
        data: [{ ...values, f_user: getUserId() }],
        type: "rpc",
      }).then((responce) => {
        refreshPage();
        setSubmitting(false);
      });
    },
  });

  useEffect(() => {
    runRpc({
      action: "cs_house",
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
    }).then((responce) => {
      setValues(responce.result.records[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Редактирование дома
        </Typography>
        <TextField
          label="Номер"
          name="c_house_number"
          value={values.c_house_number}
          error={errors.c_house_number}
          helperText={errors.c_house_number}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <TextField
          label="Корпус"
          name="c_house_corp"
          value={values.c_house_corp}
          error={errors.c_house_corp}
          helperText={errors.c_house_corp}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <TextField
          label="УИК"
          name="n_uik"
          value={values.n_uik}
          error={errors.n_uik}
          helperText={errors.n_uik}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <SelectEditor
          name={"f_subdivision"}
          fieldProps={{
            helperText: errors.f_subdivision,
            error: errors.f_subdivision,
            idProperty: "id",
            nameProperty: "c_name",
            table: "sd_subdivisions",
          }}
          label="Округ"
          mapAccessor="c_subdivision"
          value={values.f_subdivision}
          setFieldValue={setFieldValue}
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
