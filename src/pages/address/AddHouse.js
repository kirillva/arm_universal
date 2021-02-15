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

import * as Yup from "yup";
import { runRpc } from "utils/rpc";
import { SelectEditor } from "components/table/Editors";

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

export const AddHouse = ({ street, refreshPage }) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    errors,
    setFieldValue,
  } = useFormik({
    validationSchema: Yup.object().shape({
      c_house_number: Yup.string().required("Не заполнено обязательное поле"),
      n_uik: Yup.string().required("Не заполнено обязательное поле"),
      f_subdivision: Yup.string().nullable().required("Не заполнено обязательное поле"),
    }),
    initialValues: {
      c_house_number: "",
      c_house_corp: null,
      f_subdivision: null,
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_house",
        method: "Add",
        data: [
          {
            ...values,
            f_street: street,
            f_user: getUserId(),
            c_house_corp: values.c_house_corp
              ? values.c_house_corp.trim()
              : null,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        refreshPage();
        setSubmitting(false);
        // console.log(responce.result.records);
      });
    },
  });
  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Добавить дом
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
          // value={values.f_subdivision}
          setFieldValue={setFieldValue}
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
