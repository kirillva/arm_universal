import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { runRpc } from "utils/rpc";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { SelectEditor } from "components/table/Editors";
import { getUserId } from "utils/user";
import { parse } from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { GetGUID } from "utils/helpers";
import { ArrowBack } from "@material-ui/icons";
import { SelectVoterType } from "components/SelectVoterType";
import CreateIcon from "@material-ui/icons/Create";
import { useStreet } from "./address/cards/EditStreet";
import { VoterPeopleList } from "./VoterPeopleList";
import { useHouse } from "./address/cards/EditHouse";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  searchForm: {
    height: 170,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    minWidth: 450,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  addNewItem: {
    minWidth: 450,
    padding: theme.spacing(2),
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  innerContent: {
    flexDirection: "row",
    gap: theme.spacing(3),
    display: "flex",
  },
  backButton: {
    marginBottom: theme.spacing(1),
  },
  fieldWrapper: {
    display: "flex",
    gap: theme.spacing(1),
    flexDirection: "row",
  },
  field: {
    flex: 1,
  },
  button: {
    maxHeight: "40px",
  },
}));

const AddNewItem = ({ loadData, appartament }) => {
  const classes = useStyles();

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    validationSchema: Yup.object().shape({
      c_first_name: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      c_last_name: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      c_middle_name: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      n_birth_year: Yup.number()
        .nullable()
        .required("Не заполнено обязательное поле"),
      f_type: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
    }),
    initialValues: {
      c_first_name: "",
      c_last_name: "",
      c_middle_name: "",
      n_birth_year: "",
      f_type: "",
    },
    onSubmit: (values) => {
      runRpc({
        action: "cd_people",
        method: "Add",
        data: [
          {
            ...values,
            f_user: getUserId(),
            f_appartament: appartament,
          },
        ],
        type: "rpc",
      })
        .then((responce) => {
          setSubmitting(false);
          loadData();
          resetForm();
        })
        .catch(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography>Добавить нового избирателя</Typography>
      <TextField
        label="Фамилия"
        value={values.c_first_name}
        error={errors.c_first_name}
        helperText={errors.c_first_name}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_first_name"
      />
      <TextField
        label="Имя"
        value={values.c_last_name}
        error={errors.c_last_name}
        helperText={errors.c_last_name}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_last_name"
      />
      <TextField
        label="Отчество"
        value={values.c_middle_name}
        error={errors.c_middle_name}
        helperText={errors.c_middle_name}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_middle_name"
      />
      <TextField
        label="Год рождения"
        value={values.n_birth_year}
        error={errors.n_birth_year}
        helperText={errors.n_birth_year}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="n_birth_year"
      />
      <SelectVoterType
        value={values.f_type}
        error={errors.f_type}
        helperText={errors.f_type}
        handleChange={handleChange}
        name="f_type"
        margin="none"
        size="small"
      />
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={isSubmitting}
      >
        <AddIcon /> Добавить
      </Button>
    </form>
  );
};

export const VoterSearchForm = ({
  className,
  // setSelectedStreet,
  // setSelectedHouse,
}) => {
  const classes = useStyles();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  
  const history = useHistory();
  const { house, street, appartament } = parse(useLocation().search);
  
  const [streetOpen, setStreetOpen] = useState(false);
  const { openStreet, addStreet, component: streetEditor } = useStreet({
    onSave: () => {
      setStreetOpen(false);
    },
  });

  const [houseOpen, setHouseOpen] = useState(false);
  const { openHouse, addHouse, component: houseEditor } = useHouse({
    onSave: () => {
      setHouseOpen(false);
    },
  });

  const { values, setSubmitting, setFieldValue, errors } = useFormik({
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
      id: GetGUID(),
      f_house: house,
      f_street: street,
      f_appartament: appartament,
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_house",
        method: "Update",
        data: [{ ...values, f_user: getUserId() }],
        type: "rpc",
      }).then((responce) => {
        setSubmitting(false);
      });
    },
  });

  const loadData = () => {
    if (values.f_appartament) {
      setLoading(true);
      runRpc({
        action: "cd_people",
        method: "Query",
        data: [
          {
            limit: 1000,
            select:
              "id,c_first_name,c_last_name,c_middle_name,n_birth_year,f_type___c_name",
            filter: [
              {
                property: "f_appartament",
                value: values.f_appartament,
                operator: "=",
              },
            ],
            sort: [
              { property: "c_first_name", direction: "asc" },
              { property: "c_last_name", direction: "asc" },
              { property: "c_middle_name", direction: "asc" },
              { property: "f_type___c_name", direction: "asc" },
            ],
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setData(responce.result.records);
        setLoading(false);
      });
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.f_appartament]);

  return (
    <div className={classes.innerContent}>
      <div className={classes.formContainer}>
        <Button
          className={classes.backButton}
          color="primary"
          variant="contained"
          onClick={() => history.push(`/part3`)}
        >
          <ArrowBack />
          Назад
        </Button>
        <Paper className={classes.searchForm}>
          <div className={classes.fieldWrapper}>
            <SelectEditor
              className={classes.field}
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
              value={values.f_street}
              setFieldValue={(name, value) => {
                setFieldValue("f_house", "");
                setFieldValue("f_appartament", "");
                setFieldValue(name, value);
              }}
            />
            <Button
              className={classes.button}
              disabled={!values.f_street}
              variant="outlined"
              color="primary"
              onClick={() => {
                setStreetOpen(true);
                addStreet()
              }}
            >
              <AddIcon />
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={() => {
                setStreetOpen(true);
                openStreet(values.f_street)
              }}
            >
              <CreateIcon />
            </Button>
          </div>
          {values.f_street && (
            <div className={classes.fieldWrapper}>
              <SelectEditor
                className={classes.field}
                name={"f_house"}
                fieldProps={{
                  filter: [
                    {
                      property: "f_street",
                      value: values.f_street,
                      operator: "=",
                    },
                  ],
                  sortBy: "n_number",
                  margin: "none",
                  size: "small",
                  helperText: errors.f_house,
                  error: errors.f_house,
                  idProperty: "id",
                  nameProperty: "c_full_number",
                  table: "cs_house",
                }}
                label="Дом"
                value={values.f_house}
                setFieldValue={(name, value) => {
                  setFieldValue("f_appartament", "");
                  setFieldValue(name, value);
                }}
              />
              <Button
                className={classes.button}
                disabled={!values.f_house}
                variant="outlined"
                color="primary"
                onClick={() => {
                  setHouseOpen(true);
                  addHouse(values.f_street);
                  // setSelectedHouse(GetGUID());
                  // history.push(
                  //   `/part3edit/${values.f_street}/${values.f_house}`
                  // );
                }}
              >
                <AddIcon />
              </Button>
              <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => {
                  setHouseOpen(true);
                  openHouse(values.f_house);
                  // setSelectedHouse(values.f_house);
                  // history.push(`/part3edit/${values.f_street}/edit`);
                }}
              >
                <CreateIcon />
              </Button>
            </div>
          )}
          {values.f_house && (
            <div className={classes.fieldWrapper}>
              <SelectEditor
                name={"f_appartament"}
                fieldProps={{
                  filter: [
                    {
                      property: "f_house",
                      value: values.f_house,
                      operator: "=",
                    },
                  ],
                  sortBy: "n_number",
                  margin: "none",
                  size: "small",
                  helperText: errors.f_appartament,
                  error: errors.f_appartament,
                  idProperty: "id",
                  nameProperty: "c_number",
                  table: "cs_appartament",
                }}
                label="Квартира"
                value={values.f_appartament}
                setFieldValue={setFieldValue}
              />
            </div>
          )}
        </Paper>
        {values.f_appartament && (
          <Paper className={classes.addNewItem}>
            <AddNewItem
              loadData={loadData}
              appartament={values.f_appartament}
            />
          </Paper>
        )}
      </div>

      <VoterPeopleList className={className} loading={loading} data={data} />

      <Drawer
        anchor="right"
        className={classes.drawer}
        open={streetOpen}
        onClose={() => setStreetOpen(false)}
      >
        {streetEditor}
      </Drawer>
      <Drawer
        anchor="right"
        className={classes.drawer}
        open={houseOpen}
        onClose={() => setHouseOpen(false)}
      >
        {houseEditor}
      </Drawer>
    </div>
  );
};
