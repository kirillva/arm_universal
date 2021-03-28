import React from "react";
import { useFormik } from "formik";
import {
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

export const AddStreet = ({ refreshPage, validate = () => {} }) => {
  // const history = useHistory();
  const initialValues = {
    id: GetGUID(),
    c_name: "",
    c_type: "",
    c_short_type: "",
  };
  const login = getItem("login");

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
    onSubmit: (values) => {
      validate(values.c_name, () => {
        return (success)=>{
          if (success) {
            runRpc({
              action: "cs_street",
              method: "Add",
              data: [
                {
                  ...values,
                  f_user: getUserId(),
                  b_disabled: false,
                  f_main_division: login === "nov" ? 10 : 0,
                },
              ],
              type: "rpc",
            }).then(responce => {
              refreshPage();
              setSubmitting(false);
            });
          } else {
            setSubmitting(false);
          }
        }
      });
    }
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
