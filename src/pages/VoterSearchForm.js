import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { SelectEditor } from "components/table/Editors";
import { getUserId } from "utils/user";
import { parse } from "query-string";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import * as Yup from "yup";
import { GetGUID } from "utils/helpers";
import { ArrowBack } from "@material-ui/icons";

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
    flexDirection: "row",
  },
  field: {
    flex: 1,
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
    }),
    initialValues: {
      c_first_name: "",
      c_last_name: "",
      c_middle_name: "",
      n_birth_year: "",
    },
    onSubmit: (values) => {
      runRpc({
        action: "cd_people",
        method: "Add",
        data: [
          {
            ...values,
            f_user: getUserId(),
            f_type: 1,
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
  // f_house,
  // f_street,
  // f_appartment,
  className,
}) => {
  const classes = useStyles();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { house, street, appartment } = parse(useLocation().search);

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
      f_appartment: appartment,
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_house",
        method: "Update",
        data: [{ ...values, f_user: getUserId() }],
        type: "rpc",
      }).then((responce) => {
        // refreshPage();
        setSubmitting(false);
      });
    },
  });

  const loadData = () => {
    if (values.f_appartment) {
      setLoading(true);
      runRpc({
        action: "cf_bss_cs_appartament_info",
        method: "Select",
        data: [
          {
            limit: 1000,
            params: [values.f_appartment],
            sort: [
              { property: "c_first_name", direction: "asc" },
              { property: "c_last_name", direction: "asc" },
              { property: "c_middle_name", direction: "asc" },
              { property: "c_name", direction: "asc" },
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
  }, [values.f_appartment]);

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
                setFieldValue("f_appartment", "");
                setFieldValue(name, value);
              }}
            />
            <Button
              disabled={!values.f_street}
              variant="outlined"
              color="primary"
              onClick={() => {
                history.push(`/part3edit/${values.f_street}/edit`);
              }}
            >
              Редактировать
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
                  nameProperty: "c_house_number",
                  table: "cs_house",
                }}
                label="Дом"
                value={values.f_house}
                setFieldValue={(name, value) => {
                  setFieldValue("f_appartment", "");
                  setFieldValue(name, value);
                }}
              />
              <Button
                disabled={!values.f_house}
                variant="outlined"
                color="primary"
                onClick={() => {
                  history.push(
                    `/part3edit/${values.f_street}/${values.f_house}`
                  );
                }}
              >
                Редактировать
              </Button>
            </div>
          )}
          {values.f_house && (
            <div className={classes.fieldWrapper}>
              <SelectEditor
                name={"f_appartment"}
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
                  helperText: errors.f_appartment,
                  error: errors.f_appartment,
                  idProperty: "id",
                  nameProperty: "c_number",
                  table: "cs_appartament",
                }}
                label="Квартира"
                value={values.f_appartment}
                setFieldValue={setFieldValue}
              />
            </div>
          )}
        </Paper>
        {values.f_appartment && (
          <Paper className={classes.addNewItem}>
            <AddNewItem loadData={loadData} appartament={values.f_appartment} />
          </Paper>
        )}
      </div>

      <List className={className}>
        {loading ? (
          <div className={className}>
            <CircularProgress />
          </div>
        ) : data && data.length ? (
          data.map((item) => {
            const { c_first_name, c_last_name, c_middle_name, c_name } = item;
            let primaryText = "";
            if (c_first_name || c_last_name || c_middle_name) {
              primaryText = `${c_first_name || ""}	${c_last_name || ""}	${
                c_middle_name || ""
              }`;
            } else {
              primaryText = "Не указано";
            }
            return (
              <ListItem>
                <ListItemText primary={primaryText} secondary={c_name} />
                {/* <Button color="primary" variant="contained">
                  <DeleteIcon /> Удалить
                </Button> */}
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary={"Нет данных"} />
          </ListItem>
        )}
      </List>
    </div>
  );
};
