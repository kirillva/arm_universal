import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import { makeStyles } from "@material-ui/core/styles";
import { EditHouse } from "./cards/EditHouse";
import { useFormik } from "formik";
import { Appartament } from "./Appartament";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { AddNewAppartament } from "./AddNewAppartament";
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

  const useStyles = makeStyles((theme) => ({
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gap: theme.spacing(2),
      margin: theme.spacing(2),
    },
    progress: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    paper: {
      width: 100,
      height: 100,
      display: "flex",
    },
    textPaper: {
      margin: "auto",
    },
    newHouse: {
      margin: theme.spacing(2),
      display: "flex",
      gap: theme.spacing(2),
    },
    button: {
      height: 40,
    },
    editIcons: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    },
  }));

  const [appartament, setAppartament] = useState([]);
  const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadData = () => {
    setLoading(true);
    runRpc({
      action: "cs_appartament",
      method: "Query",
      data: [
        {
          select: "id,c_number,n_number,b_check,f_house,f_house___f_street",
          sort: [
            {
              property: "n_number",
              direction: "asc",
            },
          ],
          filter: [
            {
              property: "f_house",
              value: houseId,
              operator: "=",
            },
            {
              property: "f_house___f_street",
              value: street,
              operator: "=",
            },
          ],
          limit: 1000,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setLoading(false);
      setAppartament(responce.result.records);
    });
  };

  useEffect(() => {
    if (houseId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);

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
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <AddNewAppartament appartament={appartament} houseId={houseId} />

          <div className={classes.grid}>
            {appartament.map((item) => {
              return (
                <Appartament
                  setAnchorEl={setAnchorEl}
                  reloadData={loadData}
                  classes={classes}
                  item={item}
                  onClick={() => setSelectedAppartament(item)}
                />
              );
            })}
          </div>
        </>
      )}
      {selectedAppartament && (
        <>
          <AppartamentContextMenu
            onSave={()=>loadData()}
            selectedAppartament={selectedAppartament}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
          <Window
            item={selectedAppartament}
            reloadData={loadData}
            open={open}
            handleClose={() => setOpen(false)}
          />
        </>
      )}
    </>
  );
};
