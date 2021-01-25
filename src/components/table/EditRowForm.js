import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TableHead,
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

// const EditField = ({ label, ...props }) => {
//   const [field, meta, helpers] = useField();

//   const { value } = meta;
//   const { setValue } = helpers;

//   return (
//     <TextField
//       variant="outlined"
//       margin="dense"
//       label={label}
//       value={value}
//       onChange={setValue}
//     />
//   );
// };

export const EditRowForm = ({
  title,
  action,
  idProperty,
  setSelectedRow,
  selectedRow,
  columns,
}) => {
  const classes = useStyles();

  function updateSelectedRow(values, props) {
    console.log("values", values, props);
    // runRpc({
    //   action: action,
    //   method: "Update",
    //   data: [
    //     {
    //       data: [{}],
    //     },
    //   ],
    //   type: "rpc",
    // }).then((responce) => {
    //   if (responce.meta && responce.meta.success) {
    //     const _records = responce.result.records;
    //   } else {
    //   }
    // });
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
              <input hidden name={idProperty} value={selectedRow ? selectedRow.original[idProperty] : ""}/>
              {columns.map((item) => {
                const options = {
                  label: item.title,
                  onChange: props.handleChange,
                  onBlur: props.handleBlur,
                  setFieldValue: props.setFieldValue,
                  value: props.values[item.accessor],
                  name: item.accessor,
                  variant: "outlined",
                  margin: "dense",
                  fieldProps: item.fieldProps || {}
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
