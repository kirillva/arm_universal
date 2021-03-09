import React from 'react';
import { CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';

export const VoterPeopleList = ({ className, loading, data }) => {
  return (
    <List className={className}>
      {loading ? (
        <div className={className}>
          <CircularProgress />
        </div>
      ) : data && data.length ? (
        data.map((item) => {
          const {
            c_first_name,
            c_last_name,
            c_middle_name,
            f_type___c_name,
            n_birth_year,
          } = item;
          let primaryText = "";
          if (c_first_name || c_last_name || c_middle_name) {
            primaryText = `${c_first_name || ""}	${c_last_name || ""}	${
              c_middle_name || ""
            } ${n_birth_year || ""}г.`;
          } else {
            primaryText = "Не указано";
          }
          return (
            <ListItem>
              <ListItemText primary={primaryText} secondary={f_type___c_name} />
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <ListItemText primary={"Нет данных"} />
        </ListItem>
      )}
    </List>
  );
};
