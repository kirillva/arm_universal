import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { runRpc } from "utils/rpc";
import { EditHouse } from "./cards/EditHouse";
import { useFormik } from "formik";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {  useAppartament } from "./AddNewAppartament";
import { AppartamentContextMenu } from "./AppartamentContextMenu";

const Window = ({ item = {}, reloadData, open, handleClose }) => {
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    resetForm,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      c_notice: item ? item.c_notice : "",
    },
    onSubmit: (values) => {
      runRpc({
        action: "cs_appartament",
        method: "Update",
        data: [
          {
            ...values,
            id: item.id,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setSubmitting(false);
        handleClose();
        reloadData();
      });
    },
  });

  function _handleClose(...props) {
    handleClose(...props);
    resetForm();
  }

  return (
    <Dialog
      open={open}
      onClose={_handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Квартира</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          rows={3}
          label="Примечание"
          name="c_notice"
          value={values.c_notice}
          error={errors.c_notice}
          helperText={errors.c_notice}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={_handleClose} color="secondary">
          Отмена
        </Button>
        <Button variant={"contained"} onClick={handleSubmit} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const HouseDetail = ({ refreshTable, street, addNew = false }) => {
  const { houseId, streetId } = useParams();

  const match = useRouteMatch();


  const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const {
    addNewForm,
    appartamentsController,
    appartaments,
    loadData,
  } = useAppartament({
    houseId: houseId,
    street: street,
    anchorEl,
    setAnchorEl,
    setSelectedAppartament,
  });
  return (
    <>
      {houseId && (
        <EditHouse
          id={houseId}
          handleClose={() => {
            history.push(
              match.path.replace(":streetId", streetId).replace("/:houseId", "")
            );
          }}
          refreshPage={() => {
            refreshTable();
          }}
        />
      )}
      {addNew ? addNewForm : null}

      {appartamentsController}

      {appartaments}
      {selectedAppartament && (
        <>
          <AppartamentContextMenu
            onSave={() => loadData()}
            selectedAppartament={selectedAppartament}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            setOpen={setOpen}
          />
          <Window
            item={selectedAppartament}
            reloadData={loadData}
            open={open}
            handleClose={() => {
              setOpen(false)
              setSelectedAppartament(null);
            }}
          />
        </>
      )}
    </>
  );
};
