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
// import { SelectEditor } from "components/table/Editors";
// import { useHistory, useRouteMatch } from "react-router-dom";
import { GetGUID } from "utils/helpers";
import { SelectSubdivision } from "components/SelectSubdivision";
import { SelectUik } from "components/SelectUik";

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
}));

export const AddHouse = ({ street, refreshPage }) => {
  // const history = useHistory();
  // const match = useRouteMatch();

  const initialValues = {
    id: GetGUID(),
    c_house_number: "",
    c_house_corp: null,
    f_subdivision: null,
  };

  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    errors,
    submitForm,
    setFieldValue,
  } = useFormik({
    validationSchema: Yup.object().shape({
      c_house_number: Yup.string().required("Не заполнено обязательное поле"),
      n_uik: Yup.string().required("Не заполнено обязательное поле"),
      f_subdivision: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
    }),
    initialValues,
    onSubmit: async (values) => {
      const responce = await runRpc({
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
      });
      refreshPage();
      setSubmitting(false);
      return responce;
    },
  });

  // const onSubmitAndEdit = () => {
  //   submitForm().then((responce) => {
  //     if (responce) {
  //       history.push(match.path.replace(':streetId/add', `${street}/${values.id}`));
  //     }
  //   });
  // };

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Добавить дом
        </Typography>
        <div className={classes.fieldWrapper}>
          <TextField
            label="Номер"
            name="c_house_number"
            margin="none"
            size="small"
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
            margin="none"
            size="small"
            value={values.c_house_corp}
            error={errors.c_house_corp}
            helperText={errors.c_house_corp}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
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
          {/* <TextField
            label="УИК"
            name="n_uik"
            margin="none"
            size="small"
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
              margin: "none",
              size: "small",
              helperText: errors.f_subdivision,
              error: errors.f_subdivision,
              idProperty: "id",
              nameProperty: "c_name",
              table: "sd_subdivisions",
            }}
            label="Округ ЧГСД"
            mapAccessor="c_subdivision"
            // value={values.f_subdivision}
            setFieldValue={setFieldValue}
          /> */}
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Добавить дом
        </Button>
        {/* <Button
          onClick={onSubmitAndEdit}
          color="primary"
          variant="outlined"
          disabled={isSubmitting}
        >
          Добавить и редактировать дом
        </Button> */}
      </form>
    </Paper>
  );
};
