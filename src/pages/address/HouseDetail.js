import {
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";
import { makeStyles } from "@material-ui/core/styles";
import { EditHouse } from "./EditHouse";

export const HouseDetail = ({
  refreshTable,
  street,
  selectedHouse,
  setSelectedHouse,
}) => {
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
      width: 60,
      height: 60,
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
  }));

  // const [houseInfo, setHouseInfo] = useState([]);
  // const [houseInfoLoading, setHouseInfoLoading] = useState(false);
  // const [houseLoyality, setHouseLoyality] = useState([]);
  // const [houseLoyalityLoading, setHouseLoyalityLoading] = useState(false);

  const [appartament, setAppartament] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appartamentNumber, setAppartamentNumber] = useState("");
  const [error, setError] = useState("");

  const classes = useStyles();

  const { c_short_type, c_name, c_full_number, b_disabled, id } = selectedHouse
    ? selectedHouse.original
    : {};
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
          params: [null, street, id],
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
    if (selectedHouse) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHouse]);
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
      {selectedHouse && (
        <EditHouse
          id={id}
          refreshPage={() => {
            refreshTable();
            setSelectedHouse(null);
          }}
        />
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* <div className={classes.newHouse}>
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
                      f_house: selectedHouse.id,
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
          </div> */}
          <div className={classes.grid}>
            {appartament.map((item) => {
              return (
                <Paper className={classes.paper} elevation={3}>
                  <div className={classes.textPaper}>{item.c_number}</div>
                </Paper>
              );
            })}
          </div>
        </>
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
