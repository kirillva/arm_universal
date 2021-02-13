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
import { Formik, useFormik } from "formik";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

const AddNewItem = () => {
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
      c_name: "",
    },
    onSubmit: (values) => {
      resetForm();
      //   runRpc({
      //     action: "",
      //     method: "Select",
      //     data: [values],
      //     type: "rpc",
      //   }).then((responce) => {
      setSubmitting(false);
      //   });
    },
  });

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        value={values.c_first_name}
        onChange={handleChange}
        variant="outlined"
        name="c_first_name"
      />
      <TextField
        value={values.c_last_name}
        onChange={handleChange}
        variant="outlined"
        name="c_last_name"
      />
      <TextField
        value={values.c_middle_name}
        onChange={handleChange}
        variant="outlined"
        name="c_middle_name"
      />
      <TextField
        value={values.c_name}
        onChange={handleChange}
        variant="outlined"
        name="c_name"
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

export const VoterEditForm = ({ className, selectedRow }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    if (selectedRow) {
      setLoading(true);
      runRpc({
        action: "cf_bss_cs_appartament_info",
        method: "Select",
        data: [
          {
            limit: 1000,
            params: [selectedRow],
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setData(responce.result.records);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  if (loading)
    return (
      <div className={className}>
        <CircularProgress />
      </div>
    );

  return (
    <List className={className}>
      {data && data.length ? (
        data.map((item) => {
          const { c_first_name, c_last_name, c_middle_name, c_name } = item;
          let primaryText = "";
          if (c_first_name || c_last_name || c_middle_name) {
            primaryText = `${c_first_name || ""}	${c_last_name || ""}	${
              c_middle_name || ""
            }`;
          } else {
            primaryText = 'Не указано'
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
      <ListItem>
        <AddNewItem />
      </ListItem>
    </List>
  );
};
