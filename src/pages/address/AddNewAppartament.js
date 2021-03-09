import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { runRpc } from "utils/rpc";
import { Appartament } from "./Appartament";

const useStyles = makeStyles((theme) => ({
  newHouse: {
    margin: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(2),
  },
  paper: {
    width: 100,
    height: 100,
    display: "flex",
  },
  textPaper: {
    margin: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gap: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

export const AddNewAppartament = ({
  appartament,
  houseId,
  onSave = () => {},
}) => {
  const [appartamentNumber, setAppartamentNumber] = useState("");
  const [error, setError] = useState("");

  const classes = useStyles();

  return (
    <div className={classes.newHouse}>
      <TextField
        size="small"
        error={error}
        helperText={error}
        variant="outlined"
        value={appartamentNumber}
        onChange={(e) => {
          const value = e.target.value;
          const item = appartament.find((item) => item.c_number === value);
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
              onSave();
              setAppartamentNumber("");
            })
            .catch((e) => {
              setAppartamentNumber("");
            });
        }}
      >
        Добавить
      </Button>
    </div>
  );
};

export const useAppartament = ({ houseId, street }) => {
  const [appartament, setAppartament] = useState([]);
  const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

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

  return {
    addNewForm: (
      <AddNewAppartament appartament={appartament} houseId={houseId} onSave={()=>loadData()} />
    ),
    appartaments: loading ? <CircularProgress /> : (
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
    ),
  };
};
