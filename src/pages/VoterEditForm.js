import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import { DateEditor, SelectEditorField } from "components/table/Editors";
import { DatePicker } from "@material-ui/pickers";
import { getUserId } from "utils/user";
// import { getUserId } from "utils/user";

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
        data: [{
          ...values,
          // f_street: street,
          // f_house: house,
          f_user: getUserId(),
          f_type: 1,
          f_appartament: appartament,
        }],
        type: "rpc",
      }).then((responce) => {
        setSubmitting(false);
        loadData();
        resetForm();
      }).catch(()=>{
        setSubmitting(false);
      });
    },
  });

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        label="Фамилия"
        value={values.c_first_name}
        onChange={handleChange}
        variant="outlined"
        name="c_first_name"
      />
      <TextField
        label="Имя"
        value={values.c_last_name}
        onChange={handleChange}
        variant="outlined"
        name="c_last_name"
      />
      <TextField
        label="Отчество"
        value={values.c_middle_name}
        onChange={handleChange}
        variant="outlined"
        name="c_middle_name"
      />
      <TextField
        label="Год"
        value={values.n_birth_year}
        onChange={handleChange}
        variant="outlined"
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

export const VoterEditForm = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [street, setStreet] = useState(null);
  const [house, setHouse] = useState(null);
  const [appartament, setappartament] = useState(null);
  const userId = null; // getUserId();

  const classes = useStyles();

  const loadData = () => {
    if (appartament) {
      setLoading(true);
      runRpc({
        action: "cf_bss_cs_appartament_info",
        method: "Select",
        data: [
          {
            limit: 1000,
            params: [appartament],
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
  }, [appartament]);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <SelectEditorField
        fieldProps={{
          sortBy: "c_name",
          params: [userId],
          method: "Select",
          idProperty: "id",
          table: "cf_bss_cs_street",
          nameProperty: "c_name",
        }}
        value={street}
        setFieldValue={(name, value) => {
          setStreet(value);
          setHouse(null);
          setappartament(null);
        }}
        label="Улица"
      />
      {street && (
        <SelectEditorField
          fieldProps={{
            sortBy: "c_full_number",
            params: [userId, street],
            method: "Select",
            idProperty: "id",
            table: "cf_bss_cs_house",
            nameProperty: "c_full_number",
          }}
          value={house}
          setFieldValue={(name, value) => {
            setHouse(value);
            setappartament(null);
          }}
          label="Дом"
        />
      )}
      {house && (
        <SelectEditorField
          fieldProps={{
            sortBy: "c_number",
            params: [userId, street, house],
            method: "Select",
            idProperty: "id",
            table: "cf_bss_cs_appartament",
            nameProperty: "c_number",
          }}
          value={house}
          setFieldValue={(name, value) => {
            setappartament(value);
          }}
          label="Квартира"
        />
      )}
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
                <Button color="primary" variant="contained">
                  <DeleteIcon /> Удалить
                </Button>
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary={"Нет данных"} />
          </ListItem>
        )}

        {appartament && (
          <ListItem>
            <AddNewItem
              loadData={loadData}
              appartament={appartament}
            />
          </ListItem>
        )}
      </List>
    </div>
  );
};
