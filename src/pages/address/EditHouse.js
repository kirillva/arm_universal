import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Checkbox,
  FormControlLabel,
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
    gap: theme.spacing(1),
  },
  formWrapper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: 0,
    // minWidth: 300,
  },
  title: {
    textAlign: "center",
  },
  fieldWrapper: {
    display: "grid",
    gap: theme.spacing(1),
    gridTemplateColumns: "1fr 1fr",
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
      c_house_number: "",
      c_house_corp: "",
      n_uik: "",
      f_subdivision: null,
      // b_disabled: false,
      c_notice: "",
      b_check: false,
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
        <div className={classes.fieldWrapper}>
          <TextField
            size='small'
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
            size='small'
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
            size='small'
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
              margin: 'none',
              size: 'small',
              helperText: errors.f_subdivision,
              error: errors.f_subdivision,
              idProperty: "id",
              nameProperty: "c_name",
              table: "sd_subdivisions",
            }}
            label="Округ ЧГСД"
            mapAccessor="c_subdivision"
            value={values.f_subdivision}
            setFieldValue={setFieldValue}
          />
          {/* <BoolEditor
            error={errors.b_disabled}
            helperText={errors.b_disabled}
            label="Выключено"
            name="b_disabled"
            value={values.b_disabled}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          /> */}
          <TextField
            size='small'
            label="Примечание"
            name="c_notice"
            value={values.c_notice}
            error={errors.c_notice}
            helperText={errors.c_notice}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
        </div>
        <div className={classes.fieldWrapper}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={values.b_check}
                onClick={() => setFieldValue("b_check", true)}
                name="b_check"
              />
            }
            label="Подтверждаю"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={!values.b_check}
                onClick={() => setFieldValue("b_check", false)}
                name="b_check"
              />
            }
            label="Не подтверждаю"
          />
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
