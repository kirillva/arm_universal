import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Paper, TextField } from "@material-ui/core";
import { runRpc } from "utils/rpc";
import { Appartament } from "./Appartament";
import { AllAppartamentButtons } from "./AppartamentContextMenu";
import { AllAppartamentButtonsDisable } from "./AppartamentDisableMenu";
import classNames from "classnames";
import { getUserId } from "utils/user";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  newHouse: {
    margin: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(2),
  },
  newManyHouse: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  flexHorizontal: {
    gap: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
  },
  buttonFirst: {
    marginLeft: "auto",
  },
  blockPaper: {
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  paper: {
    width: 100,
    height: 100,
    display: "flex",
  },
  textPaper: {
    margin: "auto",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gap: theme.spacing(2),
    margin: theme.spacing(2),
  },
  button: {
    height: "40px",
  },
}));

export const AddOrDisableAppartament = ({
  appartament,
  houseId,
  onSave = () => {},
}) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const classes = useStyles();
  const addMany = () => {
    const appartaments = [];
    for (let i = Number(from); i <= Number(to); i++) {
      if (!appartament.find((item) => item.n_number === i)) {
        appartaments.push({
          f_created_user: getUserId(),
          c_number: `${i}`,
          n_number: i,
          f_house: houseId,
          b_off_range: false,
          b_disabled: false,
          dx_date: moment().toISOString(true),
        });
      }
    }
    if (appartaments.length) {
      runRpc({
        action: "cs_appartament",
        method: "Add",
        data: [appartaments],
        type: "rpc",
      })
        .then(() => {
          onSave();
          setTo("");
          setFrom("");
        })
        .catch((e) => {
          setTo("");
          setFrom("");
        });
    }
  };
  const disableMany = () => {
    const appartaments = appartament
      .filter((item) => {
        const c_number = Number(item.c_number);
        return c_number >= from && c_number <= to;
      })
      .map((item) => ({ b_disabled: true, id: item.id }));

    runRpc({
      action: "cs_appartament",
      method: "Update",
      data: [appartaments],
      type: "rpc",
    })
      .then((responce) => {
        onSave();
      })
      .then(() => {
        onSave();
        setTo("");
        setFrom("");
      })
      .catch((e) => {
        setTo("");
        setFrom("");
      });
  };
  const deleteMany = () => {
    const appartaments = appartament
      .filter((item) => {
        const c_number = Number(item.c_number);
        return (
          c_number >= from &&
          c_number <= to &&
          item.f_created_user === getUserId()
        );
      })
      .map((item) => ({ id: item.id }));

    runRpc({
      action: "cs_appartament",
      method: "Delete",
      data: [appartaments],
      type: "rpc",
    })
      .then((responce) => {
        onSave();
      })
      .then(() => {
        onSave();
        setTo("");
        setFrom("");
      })
      .catch((e) => {
        setTo("");
        setFrom("");
      });
  };

  return (
    <div className={classes.newManyHouse}>
      <div className={classes.flexHorizontal}>
        <TextField
          size="small"
          error={error}
          helperText={error}
          variant="outlined"
          fullWidth
          value={from}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) > Number(to)) {
              setError("Начальный номер больше конечного");
            } else {
              setError("");
            }
            setFrom(value);
          }}
          label="С"
        />
        <TextField
          size="small"
          error={error}
          helperText={error}
          variant="outlined"
          fullWidth
          value={to}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) < Number(from)) {
              setError("Начальный номер больше конечного");
            } else {
              setError("");
            }
            setTo(value);
          }}
          label="По"
        />
      </div>
      <div className={classes.flexHorizontal}>
        <Button
          className={classNames(classes.button, classes.buttonFirst)}
          disabled={!Boolean(from) || !Boolean(to)}
          color="primary"
          variant="contained"
          onClick={addMany}
        >
          Добавить
        </Button>
        <Button
          className={classes.button}
          disabled={!Boolean(from) || !Boolean(to)}
          color="primary"
          variant="contained"
          onClick={deleteMany}
        >
          Удалить
        </Button>
        <Button
          className={classNames(classes.button, classes.buttonFirst)}
          disabled={!Boolean(from) || !Boolean(to)}
          color="primary"
          variant="contained"
          onClick={disableMany}
        >
          Деактивировать
        </Button>
      </div>
    </div>
  );
};

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
        fullWidth
        value={appartamentNumber}
        onChange={(e) => {
          const value = e.target.value;
          const item = appartament.find((item) => item.c_number === value);
          if (item) {
            if (item.b_disabled) {
              setError(
                `Квартира ${value} уже существует, но деактивирована. Вы можете активировать ее, нажав на номер в списке ниже.`
              );
            } else {
              setError(`Квартира ${value} уже существует`);
            }
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
                f_created_user: getUserId(),
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

export const useAppartament = ({
  houseId,
  street,
  // anchorEl = null,
  setAnchorEl = () => {},
  setSelectedAppartament = () => {},
  enableDelete = false,
}) => {
  const [appartament, setAppartament] = useState([]);
  // const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  const loadData = () => {
    setLoading(true);
    runRpc({
      action: "cs_appartament",
      method: "Query",
      data: [
        {
          select:
            "id,c_number,c_notice,n_number,b_check,f_house,f_house___f_street,f_created_user,b_disabled",
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
      <Paper className={classes.blockPaper}>
        <AddNewAppartament
          appartament={appartament}
          houseId={houseId}
          onSave={() => loadData()}
        />
      </Paper>
    ),
    addOrDisableForm: (
      <Paper className={classes.blockPaper}>
        <AddOrDisableAppartament
          appartament={appartament}
          houseId={houseId}
          onSave={() => loadData()}
        />
      </Paper>
    ),
    loadData,
    appartamentsController: enableDelete ? (
      <AllAppartamentButtonsDisable
        appartaments={appartament}
        onSave={() => loadData()}
      />
    ) : (
      <AllAppartamentButtons
        appartaments={appartament}
        onSave={() => loadData()}
      />
    ),
    appartaments: loading ? (
      <CircularProgress />
    ) : (
      <div className={classes.grid}>
        {appartament.map((item) => {
          return (
            <Appartament
              enableDelete={enableDelete}
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
