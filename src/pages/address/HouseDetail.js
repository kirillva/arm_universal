import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import { makeStyles } from "@material-ui/core/styles";
import { EditHouse } from "./cards/EditHouse";
import EditIcon from "@material-ui/icons/Edit";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { useFormik } from "formik";
import { Appartament } from "./Appartament";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";

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

export const HouseDetail = ({
  refreshTable,
  street,
  addNew = false,
  // selectedHouse,
  // setSelectedHouse,
}) => {
  const { houseId, streetId } = useParams();

  const match = useRouteMatch();

  const useStyles = makeStyles((theme) => ({
    // drawer: {
    //   width: 400,
    // },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gap: theme.spacing(2),
      margin: theme.spacing(2),
    },
    // text: {
    //   margin: theme.spacing(2),
    // },
    progress: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    paper: {
      width: 100,
      height: 100,
      display: "flex",
      // margin: "auto",
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
      // display: "flex",
      // flexDirection: "row",
      // alignItems: "center",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    },
  }));

  // const [houseInfo, setHouseInfo] = useState([]);
  // const [houseInfoLoading, setHouseInfoLoading] = useState(false);
  // const [houseLoyality, setHouseLoyality] = useState([]);
  // const [houseLoyalityLoading, setHouseLoyalityLoading] = useState(false);

  const [appartament, setAppartament] = useState([]);
  const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appartamentNumber, setAppartamentNumber] = useState("");
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const { c_short_type, c_name, c_full_number, b_disabled, id } = selectedHouse
  //   ? selectedHouse.original
  //   : {};

  // useEffect(() => {
  //   if (street && selectedHouse) {
  //     setHouseInfo([]);
  //     setHouseInfoLoading(true);
  //     runRpc({
  //       action: "cf_bss_cs_house_info",
  //       method: "Select",
  //       data: [
  //         {
  //           params: [street, selectedHouse],
  //           limit: 1000,
  //         },
  //       ],
  //       type: "rpc",
  //     }).then((responce) => {
  //       setHouseInfo(responce.result.records);
  //       setHouseInfoLoading(false);
  //     });
  //     setHouseLoyality([]);
  //     setHouseLoyalityLoading(true);
  //     runRpc({
  //       action: "cf_bss_cs_house_loyalty",
  //       method: "Select",
  //       data: [
  //         {
  //           params: [street, selectedHouse],
  //           limit: 1000,
  //         },
  //       ],
  //       type: "rpc",
  //     }).then((responce) => {
  //       setHouseLoyality(responce.result.records);
  //       setHouseLoyalityLoading(false);
  //     });
  //   }
  // }, [street, selectedHouse]);

  // SELECT * from dbo.(180101,'c0c21675-3691-4ecd-bb5f-727a9ffdc7d9', '8c3c6638-5c0a-43f6-b236-c829431e8af2');

  const loadData = () => {
    setLoading(true);
    if (addNew) {
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
    } else {
      runRpc({
        action: "cf_bss_cs_appartament",
        method: "Select",
        data: [
          {
            sort: [
              {
                property: "n_number",
                direction: "asc",
              },
            ],
            params: [null, street, houseId],
            limit: 1000,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setLoading(false);
        setAppartament(responce.result.records);
      });
    }
  };

  useEffect(() => {
    if (houseId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);

  const onSendSelected = (b_check) => {
    runRpc({
      action: "cs_appartament",
      method: "Update",
      data: [{ b_check: !Boolean(b_check), id: selectedAppartament.id }],
      type: "rpc",
    }).then((responce) => {
      loadData();
    });
  };
  /* <Button
    className={classes.button}
    // disabled={!Boolean(appartamentNumber) || error}
    color="primary"
    variant="contained"
    onClick={() => {
      runRpc({
        action: "cs_house",
        method: "Update",
        data: [
          {
            id,
            b_disabled: !b_disabled,
          },
        ],
        type: "rpc",
      }).then(() => {
        // setLoading(false);
        setSelectedHouse(null);
        refreshTable();
      });
    }}
  >
    {b_disabled ? "Включить" : "Выключить"}
  </Button> */
  return (
    <>
      {houseId && (
        <EditHouse
          id={houseId}
          handleClose={() => {
            history.push(
              match.path.replace(":streetId", streetId).replace("/:houseId", "")
            )
          }}
          refreshPage={() => {
            refreshTable();
            // setSelectedHouse(null);
          }}
        />
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {addNew && (
            <div className={classes.newHouse}>
              <TextField
                size="small"
                error={error}
                helperText={error}
                variant="outlined"
                value={appartamentNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  const item = appartament.find(
                    (item) => item.c_number === value
                  );
                  if (item) {
                    setError(`Квартира ${value} уже существует`);
                  } else {
                    setError(null);
                  }
                  setAppartamentNumber(value);
                }}
                label="Номер квартиры"
              />
              <Button
                className={classes.button}
                disabled={!Boolean(appartamentNumber) || error}
                color="primary"
                variant="contained"
                onClick={() => {
                  // setLoading(true);
                  runRpc({
                    action: "cs_appartament",
                    method: "Add",
                    data: [
                      {
                        c_number: appartamentNumber,
                        n_number: Number.parseInt(appartamentNumber),
                        f_house: houseId,
                        b_off_range: false,
                      },
                    ],
                    type: "rpc",
                  })
                    .then(() => {
                      // setLoading(false);
                      loadData();
                      setAppartamentNumber("");
                    })
                    .catch((e) => {
                      // setLoading(false);
                      setAppartamentNumber("");
                    });
                }}
              >
                Добавить
              </Button>
            </div>
          )}
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
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {selectedAppartament && (
          <>
            <MenuItem
              button
              onClick={() => {
                onSendSelected(false);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                {selectedAppartament.b_check === true ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </ListItemIcon>
              Подтверждаю
            </MenuItem>
            <MenuItem
              button
              onClick={() => {
                onSendSelected(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                {selectedAppartament.b_check === false ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </ListItemIcon>
              Не подтверждаю
            </MenuItem>
            <MenuItem
              button
              onClick={() => {
                setOpen(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Указать примечание
            </MenuItem>
          </>
        )}
        {/* <MenuItem
          button
          onClick={() => {
          }}
        >
          I этап: привязка домов
        </MenuItem>
        <MenuItem
          button
          onClick={() => {
          }}
        >
          II этап: подтверждение
        </MenuItem>
        <MenuItem
          button
          onClick={() => {
            
          }}
        >
          Выход
        </MenuItem> */}
      </Menu>
      {selectedAppartament && (
        <Window
          item={selectedAppartament}
          reloadData={loadData}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
      {/* <List>
          <Typography className={classes.text}>Избиратели</Typography>
          {!houseInfoLoading ? (
            houseInfo && houseInfo.length ? (
              houseInfo.map((item) => {
                return (
                  <ListItem>
                    <ListItemText
                      primary={item.c_people_types}
                      secondary={`
                          Число квартир: ${item.n_appart_count};
                          Число избирателей: ${item.n_count}; 
                          Процент: ${Number(item.n_percent)}%
                        `}
                    />
                  </ListItem>
                );
              })
            ) : <Typography className={classes.text}>Нет данных</Typography>
          ) : (
            <CircularProgress className={classes.progress} />
          )}
        </List>
        <List>
          <Typography className={classes.text}>Процент лояльности</Typography>
          {!houseLoyalityLoading ? (
            houseLoyality && houseLoyality.length ? (
              houseLoyality.map((item) => {
                return (
                  <ListItem>
                    <ListItemText
                      primary={item.n_year}
                      secondary={`${Number(item.n_rating)}%`}
                    />
                  </ListItem>
                );
              })
            ) : <Typography className={classes.text}>Нет данных</Typography>
          ) : (
            <CircularProgress className={classes.progress} />
          )}
        </List> */}
    </>
  );
};
