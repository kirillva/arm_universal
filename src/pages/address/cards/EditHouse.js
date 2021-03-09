import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { SelectEditor } from "components/table/Editors";
import { SelectUik } from "components/SelectUik";
import { SelectSubdivision } from "components/SelectSubdivision";
import * as Yup from "yup";
import { AddHouse } from "./AddHouse";
import { AddNewAppartament, useAppartament } from "../AddNewAppartament";

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

export const EditHouse = ({ id, refreshPage, handleClose }) => {
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
    validationSchema: Yup.object().shape({
      c_house_number: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      n_uik: Yup.string().nullable().required("Не заполнено обязательное поле"),
      f_subdivision: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      f_street: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      b_check: Yup.boolean().typeError("Должно быть указано одно из значений"),
    }),
    initialValues: {
      id: id,
      c_house_number: "",
      c_house_corp: "",
      n_uik: "",
      f_subdivision: "",
      // b_disabled: false,
      f_street: "",
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
          <FormControl
            required
            error={errors.b_check}
            component="fieldset"
            className={classes.formControl}
          >
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values.b_check === true}
                  onClick={() => setFieldValue("b_check", true)}
                  name="b_check"
                />
              }
              label="Подтверждаю"
            />
            <FormHelperText>{errors.b_check || ""}</FormHelperText>
          </FormControl>
          <FormControl
            required
            error={errors.b_check}
            component="fieldset"
            className={classes.formControl}
          >
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values.b_check === false}
                  onClick={() => setFieldValue("b_check", false)}
                  name="b_check"
                />
              }
              label="Не подтверждаю"
            />
            <FormHelperText>{errors.b_check || ""}</FormHelperText>
          </FormControl>
        </div>
        <div className={classes.fieldWrapper}>
          <SelectSubdivision
            margin="none"
            size="small"
            name="f_subdivision"
            value={values.f_subdivision}
            error={errors.f_subdivision}
            handleChange={(...props) => {
              setFieldValue("n_uik", "");
              handleChange(...props);
            }}
            isSubmitting={isSubmitting}
          />
          <SelectUik
            margin="none"
            size="small"
            name="n_uik"
            subdivision={values.f_subdivision}
            value={values.n_uik}
            error={errors.n_uik}
            handleChange={handleChange}
            isSubmitting={isSubmitting}
          />
          <SelectEditor
            name={"f_street"}
            fieldProps={{
              margin: "none",
              size: "small",
              helperText: errors.f_street,
              error: errors.f_street,
              idProperty: "id",
              nameProperty: "c_name",
              table: "cv_street",
            }}
            label="Улица"
            // mapAccessor="n_uik"
            value={values.f_street}
            setFieldValue={setFieldValue}
          />
          <TextField
            size="small"
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
            size="small"
            label="Корпус"
            name="c_house_corp"
            value={values.c_house_corp}
            error={errors.c_house_corp}
            helperText={errors.c_house_corp}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
        </div>
        <TextField
          multiline
          rows={3}
          size="small"
          label="Примечание"
          name="c_notice"
          value={values.c_notice}
          error={errors.c_notice}
          helperText={errors.c_notice}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <div className={classes.fieldWrapper}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            Сохранить
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={isSubmitting}
            onClick={() => handleClose()}
          >
            Отменить
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export const useHouse = (props) => {
  const { onSave = () => {}, onCancel = () => {} } = props || {};
  const [house, setHouse] = useState(null);
  const [street, setStreet] = useState(null);

  const handleSave = () => {
    onSave();
    setHouse(null);
    setStreet(null);
  };
  const { addNewForm, appartaments } = useAppartament({
    houseId: house,
    street: street,
  });

  return {
    openHouse: (f_street, f_house) => {
      setHouse(f_house);
      setStreet(f_street);
    },
    addHouse: (f_street) => {
      setHouse(null);
      setStreet(f_street);
    },
    component: (
      <>
        {street && !house && <AddHouse street={street} refreshPage={handleSave} />}
        {street && house && (
          <>
            <EditHouse
              id={house}
              refreshPage={handleSave}
              handleClose={() => {
                onCancel();
                setHouse(null);
                setStreet(null);
              }}
            />
            {addNewForm}
            {appartaments}
          </>
        )}
      </>
    ),
  };
};
