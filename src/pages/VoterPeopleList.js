import React from "react";
import {
  Button,
  CircularProgress,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { runRpc } from "utils/rpc";
import { useMessageContext } from "components/hooks/MessageContext";

export const VoterPeopleList = ({ className, loading, data, loadData }) => {
  const _onDelete = (id) => {
    runRpc({
      action: "cd_people",
      method: "Delete",
      data: [{ id: id }],
      type: "rpc",
    }).then((responce) => {
      loadData();
    });
  }
  
  const onDelete = (id) => {
    ShowAcceptWindow({
      title: 'Удаление',
      components: <DialogContent>Вы действительно хотите удалить этого избирателя?</DialogContent>,
      buttons: [
        {
          color: 'primary',
          text: 'Да',
          handler: () => {
            _onDelete(id);
          }
        },
        {
          color: 'secondary',
          text: 'Отмена'
        }
      ]
    })
  }
  
  const { ShowAcceptWindow } = useMessageContext();
  
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
              <Button>
                <Delete onClick={()=>onDelete(item.id)} />
              </Button>
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
