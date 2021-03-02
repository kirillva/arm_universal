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
import {
  SelectEditor,
  SelectEditorField,
} from "components/table/Editors";
import { getUserId } from "utils/user";
import { parse } from "query-string";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { GetGUID } from "utils/helpers";


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
    // minWidth: 300,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  addNewItem: {
    minWidth: 300,
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
}));

const AddNewItem = ({ loadData, appartament }) => {
  const classes = useStyles();

  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
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
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_first_name"
      />
      <TextField
        label="Имя"
        value={values.c_last_name}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_last_name"
      />
      <TextField
        label="Отчество"
        value={values.c_middle_name}
        onChange={handleChange}
        variant="outlined"
        margin="none"
        size="small"
        name="c_middle_name"
      />
      <TextField
        label="Год рождения"
        value={values.n_birth_year}
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

export const VoterSearchForm = ({ className }) => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const location = useLocation();
  const { f_house, f_street, f_appartment } = parse(location.search);

  const [loading, setLoading] = useState(false);

  const {
    // handleSubmit,
    // handleChange,
    values,
    // isSubmitting,
    setSubmitting,
    // setValues,
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
      b_check: Yup.boolean().typeError('Должно быть указано одно из значений')
    }),
    initialValues: {
      id: GetGUID(),
      f_house: "",
      f_street: "",
      f_appartment: "",
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
  const loadData = () => {}
  // const loadData = () => {
  //   if (f_appartment) {
  //     setLoading(true);
  //     runRpc({
  //       action: "cf_bss_cs_appartament_info",
  //       method: "Select",
  //       data: [
  //         {
  //           limit: 1000,
  //           params: [f_appartment],
  //           sort: [
  //             { property: "c_first_name", direction: "asc" },
  //             { property: "c_last_name", direction: "asc" },
  //             { property: "c_middle_name", direction: "asc" },
  //             { property: "c_name", direction: "asc" },
  //           ],
  //         },
  //       ],
  //       type: "rpc",
  //     }).then((responce) => {
  //       setData(responce.result.records);
  //       setLoading(false);
  //     });
  //   } else {
  //     setData([]);
  //   }
  // };

  // useEffect(() => {
  //   loadData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [f_appartment]);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.innerContent}>
        <div className={classes.formContainer}>
          <Paper className={classes.searchForm}>
            {/* <SelectEditorField
              fieldProps={{
                sortBy: "c_name",
                params: [null],
                method: "Select",
                idProperty: "id",
                table: "cf_bss_cs_street",
                nameProperty: "c_name",
              }}
              value={street}
              setInputValue
              setFieldValue={(name, value) => {
                setStreet(value);
                setHouse(null);
                setAppartament(null);
              }}
              label="Улица"
            /> */}
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
              value={values.f_street}
              setFieldValue={setFieldValue}
            />
            {values.f_street && (
              <SelectEditor
                name={"f_house"}
                fieldProps={{
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
                setFieldValue={setFieldValue}
              />
            )}
            {values.f_house && (
              <SelectEditor
                name={"f_appartment"}
                fieldProps={{
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
    </div>
  );
};
