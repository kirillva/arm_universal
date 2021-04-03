import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { runRpc } from "utils/rpc";
import { useField, Formik } from "formik";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "grid",
    columnGap: theme.spacing(1),
    gridTemplateColumns: "1fr 1fr",
  },
}));

export const EditRowForm = ({
  title,
  action,
  idProperty,
  setSelectedRow,
  selectedRow,
  columns,
  editForm,
  handleSave
}) => {
  const classes = useStyles();

  function updateSelectedRow(values, props) {
    const record = {};
    columns.forEach((item) => {
      record[item.accessor] = values[item.accessor];
    });
    record[idProperty] = values[idProperty];
    
    handleSave(values);
  }

  return (
    <Dialog onClose={() => setSelectedRow(null)} open={Boolean(selectedRow)}>
      <DialogTitle>Редактирование</DialogTitle>
      <Formik
        initialValues={selectedRow ? selectedRow.original : {}}
        onSubmit={updateSelectedRow}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <DialogContent className={classes.dialogContent}>
              <input
                hidden
                name={idProperty}
                value={selectedRow ? selectedRow.original[idProperty] : ""}
              />
              {editForm
                ? editForm(selectedRow ? selectedRow.original : null)
                : columns.map((item) => {
                    const options = {
                      label: item.title,
                      onChange: props.handleChange,
                      onBlur: props.handleBlur,
                      setFieldValue: props.setFieldValue,
                      value: props.values[item.accessor],
                      name: item.accessor,
                      variant: "outlined",
                      margin: "dense",
                      fieldProps: item.fieldProps || null,
                    };
                    if (item.Editor) {
                      return React.createElement(item.Editor, options);
                    } else {
                      return <TextField {...options} />;
                    }
                  })}
            </DialogContent>
            <DialogActions>
              <Button color="primary" variant="contained" type="submit">
                Сохранить
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
