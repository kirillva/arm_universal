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

export const EditStreet = ({ id, refreshPage, street }) => {
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
      // b_disabled: false,
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
          {/* <BoolEditor
            size="small"
            margin="none"
            error={errors.b_disabled}
            helperText={errors.b_disabled}
            label="Отключена"
            name="b_disabled"
            value={values.b_disabled}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          /> */}
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
  const { onSave = () => {} } = props || {};
  const [street, setStreet] = useState(null);
  const [id, setId] = useState(null);

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
  }

  useEffect(() => {
    if (id && id != 'new') {
      loadData(id);
    }
  }, [id]);

  const handleSave = () => {
    onSave();
  }

  return {
    openStreet: (id) => {
      setId(id);
      loadData(id);
    },
    addStreet: () => {
      setId('new');
    },
    component: id == 'new' ? <AddStreet refreshPage={handleSave} /> : <EditStreet id={id} refreshPage={handleSave} street={street} />,
  };
};
