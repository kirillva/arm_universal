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
import { getUserId } from "utils/user";

import * as Yup from "yup";
import { runRpc } from "utils/rpc";
// import { SelectEditor } from "components/table/Editors";
// import { useHistory, useRouteMatch } from "react-router-dom";
import { GetGUID } from "utils/helpers";
import { SelectSubdivision } from "components/SelectSubdivision";
import { SelectUik } from "components/SelectUik";
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

export const AddHouse = ({ street, refreshPage }) => {
  const initialValues = {
    id: GetGUID(),
    c_house_number: "",
    c_house_corp: "",
    c_house_litera: "",
    f_subdivision: null,
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingRecords, setExistingRecords] = useState([]);
  const classes = useStyles();

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
      const exist = await loadExistingRecords(values);
      setExistingRecords(exist);
      let responce = [];
      if (exist && exist.length) {
        setOpen(true);
      } else {
        setOpen(false);
        responce = await saveValues(values, street);
        refreshPage(values.id);
      }
      setSubmitting(false);
      return responce;
    },
  });

  const saveValues = async (values, street) => {
    const responce = await runRpc({
      action: "cs_house",
      method: "Add",
      data: [
        {
          ...values,
          id: GetGUID(),
          f_street: street,
          f_user: getUserId(),
          c_house_corp: values.c_house_corp ? values.c_house_corp.trim() : null,
          c_house_litera: values.c_house_litera
            ? values.c_house_litera.trim()
            : null,
        },
      ],
      type: "rpc",
    });
    return responce;
  };

  async function loadExistingRecords(_values) {
    const { c_house_number, c_house_corp, c_house_litera } = _values;
    const filter = [
      {
        property: "f_street",
        value: street,
        operator: "=",
      },
      {
        property: "c_house_number",
        value: c_house_number,
        operator: "=",
      },
    ];
    if (c_house_corp) {
      filter.push({
        property: "c_house_corp",
        value: c_house_corp,
        operator: "like",
      });
    }
    if (c_house_litera) {
      filter.push({
        property: "c_house_litera",
        value: c_house_litera,
        operator: "like",
      });
    }
    const exist = await runRpc({
      action: "cs_house",
      method: "Query",
      data: [
        {
          filter: filter,
          limit: 10000,
        },
      ],
      type: "rpc",
    });
    if (exist && exist.result.records.length) {
      return exist.result.records;
    } else return []
  }
  // const onSubmitAndEdit = () => {
  //   submitForm().then((responce) => {
  //     if (responce) {
  //       history.push(match.path.replace(':streetId/add', `${street}/${values.id}`));
  //     }
  //   });
  // };

  return (
    <Paper className={classes.formWrapper}>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Добавление</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography>Уже существуют следующие дома:</Typography>
          {existingRecords.map((item) => {
            const { c_full_number, id, b_disabled } = item;
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Typography className={classes.houseName}>
                  {c_full_number}
                </Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    runRpc({
                      action: "cs_house",
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
          <Typography>Вы действительно хотите добавить дом?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            color="primary"
            variant="contained"
            onClick={() => {
              setLoading(true);
              saveValues(values, street)
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
          <TextField
            label="Литера"
            name="c_house_litera"
            margin="none"
            size="small"
            value={values.c_house_litera}
            error={errors.c_house_litera}
            helperText={errors.c_house_litera}
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
