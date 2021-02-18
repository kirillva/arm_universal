import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getUserId, getItem } from "utils/user";
import { runRpc } from "utils/rpc";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  formWrapper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    // minWidth: 500,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  titleWrapper: {
    display: "flex",
  },
}));

const LEFT = 37;
const RIGHT = 39;
const TOP = 38;
const DOWN = 40;
const SPACE = 32;

const initialValues = {
  f_subdivision: null,
  c_house_number: "",
  c_house_corp: "",
  c_house_litera: "",
  n_uik: "",
  b_disabled: false,
  f_house: null,
};
export const EditHouseHistory = ({
  selectedHouse,
  setSelectedHouse,
  refreshPage,
  next,
  previous,
}) => {
  const login = getItem("login");

  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setValues,
    errors,
    resetForm,
    submitForm,
    validateForm,
    setFieldValue,
    isValid
  } = useFormik({
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      n_uik: Yup.number().integer().nullable().required("Не заполнено обязательное поле"),
      c_house_number: Yup.string().required("Не заполнено обязательное поле"),
      f_subdivision: Yup.number()
        .nullable()
        .integer()
        .required("Не заполнено обязательное поле"),
    }),
    initialValues: initialValues,
    onSubmit: async (values) => {
      const b_tmp_kalinin = values.b_tmp_kalinin || login === "kalinin";
      const b_tmp_lenin = values.b_tmp_lenin || login === "lenin";
      const b_tmp_moscow = values.b_tmp_moscow || login === "moscow";

      const {
        id,
        n_uik,
        f_subdivision,
        c_house_number,
        c_house_corp,
        c_house_litera,
      } = values;
      runRpc({
        action: "cf_tmp_house_update",
        method: "Query",
        data: [
          {
            params: [
              id,
              getUserId(),
              n_uik,
              f_subdivision,
              c_house_number,
              c_house_corp,
              c_house_litera,
              b_tmp_kalinin,
              b_tmp_lenin,
              b_tmp_moscow,
            ],
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setSubmitting(false);
        refreshPage();
      });
    },
  });

  const [subdivisions, setSubdivisions] = useState([]);
  const [uik, setUik] = useState([]);

  useEffect(() => {
    resetForm();
    const innerValues = {};
    Object.keys(selectedHouse).forEach((key) => {
      innerValues[key] = selectedHouse[key] || initialValues[key];
    });
    setValues(innerValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHouse]);

  useEffect(() => {
    const filter = [];
    if (values.f_subdivision) {
      filter.push({
        property: "f_subdivision",
        value: values.f_subdivision,
        operator: "=",
      });
    }
    runRpc({
      action: "cv_uik_ref",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "f_uik", direction: "asc" }],
          filter: filter,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setUik(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.f_subdivision]);

  useEffect(() => {
    runRpc({
      action: "sd_subdivisions",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "n_code", direction: "asc" }],
          filter: [{ property: "id", value: 0, operator: "gt" }],
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setSubdivisions(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function keyDownTextField(e) {
    var keyCode = e.keyCode;

    if (selectedHouse) {
      switch (keyCode) {
        case LEFT:
          previous();
          break;

        case RIGHT:
          next();
          break;

        case TOP:
          previous();
          break;

        case DOWN:
          next();
          break;

        // case SPACE:
        //   submitForm();
        //   // next();
        //   break;

        default:
          break;
      }
    }
  }

  useEffect(() => {
    global.document.addEventListener("keydown", keyDownTextField, false);
    return () => {
      global.document.removeEventListener("keydown", keyDownTextField, false);
    };
  }, [selectedHouse]);

  const classes = useStyles();

  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.titleWrapper}>
          <Typography variant="h6" className={classes.title}>
            Редактирование дома #{values.n_row}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            onClick={() => setSelectedHouse(null)}
          >
            <CloseIcon />
          </Button>
        </div>

        <TextField
          title={values.c_name}
          margin="dense"
          disabled
          label="Улица"
          value={values.c_name}
          variant="outlined"
        />
        <TextField
          margin="dense"
          select
          label="Округ ЧГСД"
          name="f_subdivision"
          value={Number(values.f_subdivision)}
          error={errors.f_subdivision}
          helperText={errors.f_subdivision}
          onChange={(...props)=>{
            setFieldValue('n_uik', null);
            handleChange(...props);
          }}
          disabled={isSubmitting}
          variant="outlined"
        >
          <MenuItem value={null}>Не выбрано</MenuItem>
          {subdivisions.map((item) => (
            <MenuItem value={item.id}>{item.c_name}</MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
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
          margin="dense"
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
          margin="dense"
          label="Литера"
          name="c_house_litera"
          value={values.c_house_litera}
          error={errors.c_house_litera}
          helperText={errors.c_house_litera}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <TextField
          select
          margin="dense"
          label="УИК"
          name="n_uik"
          value={values.n_uik}
          error={errors.n_uik}
          helperText={errors.n_uik}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        >
          <MenuItem value={null}>Не выбрано</MenuItem>
          {uik.map((item) => (
            <MenuItem value={item.f_uik}>{item.f_uik}</MenuItem>
          ))}
        </TextField>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(values.b_tmp_kalinin)}
                onChange={handleChange}
                // name="b_tmp_kalinin"
                disabled={true}
              />
            }
            label="Калининский"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(values.b_tmp_lenin)}
                onChange={handleChange}
                // name="b_tmp_lenin"
                disabled={true}
              />
            }
            label="Ленинский"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(values.b_tmp_moscow)}
                onChange={handleChange}
                disabled={true}
              />
            }
            label="Московский"
          />
        </div>
        <TextField
          margin="dense"
          disabled
          label="Число квартир"
          value={values.n_premise_count}
          variant="outlined"
        />
        <Button
          onClick={()=>{
            validateForm();
            if (isValid) {
              submitForm();
            }
          }}
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
