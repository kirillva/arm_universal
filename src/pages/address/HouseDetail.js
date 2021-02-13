import {
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";

import { makeStyles } from "@material-ui/core/styles";

export const HouseDetail = ({ street, selectedHouse, setSelectedHouse }) => {
  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: 300,
    },
  }));

  const [houseInfo, setHouseInfo] = useState([]);
  const [houseInfoLoading, setHouseInfoLoading] = useState(false);
  const [houseLoyality, setHouseLoyality] = useState([]);
  const [houseLoyalityLoading, setHouseLoyalityLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (street && selectedHouse) {
      setHouseInfo([]);
      setHouseInfoLoading(true);
      runRpc({
        action: "cf_bss_cs_house_info",
        method: "Select",
        data: [
          {
            params: [street, selectedHouse],
            limit: 1000,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setHouseInfo(responce.result.records);
        setHouseInfoLoading(false);
      });
      setHouseLoyality([]);
      setHouseLoyalityLoading(true);
      runRpc({
        action: "cf_bss_cs_house_loyalty",
        method: "Select",
        data: [
          {
            params: [street, selectedHouse],
            limit: 1000,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setHouseLoyality(responce.result.records);
        setHouseLoyalityLoading(false);
      });
    }
  }, [street, selectedHouse]);
  return (
    <Drawer
      anchor={"right"}
      open={Boolean(street && selectedHouse)}
      onClose={() => {
        setSelectedHouse(null);
        // history.push({
        //   pathname: "/voters",
        // });
      }}
    >
      <div className={classes.drawer}>
        <Typography>Избиратели</Typography>
        {!houseInfoLoading ? (
          <List>
            {houseInfo && houseInfo.length
              ? houseInfo.map((item) => {
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
              : null}
          </List>
        ) : (
          <CircularProgress />
        )}
        <Typography>Процент лояльности</Typography>
        {!houseLoyalityLoading ? (
          <List>
            {houseLoyality && houseLoyality.length
              ? houseLoyality.map((item) => {
                  return (
                    <ListItem>
                      <ListItemText
                        primary={item.n_year}
                        secondary={`${Number(item.n_rating)}%`}
                      />
                    </ListItem>
                  );
                })
              : null}
          </List>
        ) : (
          <CircularProgress />
        )}
      </div>
    </Drawer>
  );
};
