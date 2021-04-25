import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { runRpcRecords } from "utils/rpc";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  historyWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: '15px'
  },
  item: {
    margin: '0 10px 0 0',
  }
}));

export const DocumentHistory = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (id !== -1) {
      setLoading(true);
      runRpcRecords({
        action: "cf_arm_dd_documents_history",
        method: "Query",
        data: [
          {
            params: [id],
          },
        ],
        type: "rpc",
      })
        .then((records) => setHistory(records))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className={classes.historyWrapper}>
      {loading ? (
        <CircularProgress />
      ) : (
        history.map((item) => {
          const { c_operation, d_date, c_user, jb_old_value, jb_new_value } = item;

          const getValue = (name) => {
            return jb_new_value[name] || "нет";
          }          

          return <div>
            <b>Дата изменений:</b>  <span className={classes.item}>{moment(d_date).format('DD.MM.YYYY HH:mm')}</span>    
            <b>Пользователь:</b>  <span className={classes.item}>{c_user}</span>    
            <b>Операция:</b>  <span className={classes.item}>{c_operation === 'INSERT' ? 'Добавление' : 'Изменение'}</span>
            <b>{'Номер:'}</b> <span className={classes.item}>{getValue('n_number')}</span>
            <b>{'ФИО заявителя:'}</b> <span className={classes.item}>{getValue('c_fio')}</span>
            <b>{'Номер телефона:'}</b> <span className={classes.item}>{getValue('c_phone')}</span>
            <b>{'Дата рождения:'}</b> <span className={classes.item}>{moment(jb_new_value.d_birthday).format('DD.MM.YYYY')}</span>
            <b>{'Возраст на момент постановки:'}</b> <span className={classes.item}>{getValue('n_year')}</span>
            <b>{'Реквизиты документа, удостоверяющего личность:'}</b> <span className={classes.item}>{getValue('c_document')}</span>
            <b>{'Адрес, телефон:'}</b> <span className={classes.item}>{getValue('c_address')}</span>
            <b>{'Дата подачи заявления:'}</b> <span className={classes.item}>{moment(jb_new_value.d_date).format('DD.MM.YYYY')}</span>
            <b>{'Время подачи заявления:'}</b> <span className={classes.item}>{getValue('c_time')}</span>
            <b>{'Цель использования земельного участка:'}</b> <span className={classes.item}>{getValue('c_intent')}</span>
            <b>{'Постановление о постановке на учет:'}</b> <span className={classes.item}>{getValue('c_account')}</span>
            <b>{'Решение о снятии с учета:'}</b> <span className={classes.item}>{getValue('d_take_off_solution')}</span>
            <b>{'Сообщение заявителю о снятии с учета:'}</b> <span className={classes.item}>{getValue('d_take_off_message')}</span>
            <b>{'Примечание:'}</b> <span className={classes.item}>{getValue('c_notice')}</span>
            <b>{'Дата и номер принятия решения:'}</b> <span className={classes.item}>{getValue('c_accept')}</span>
            <b>{'Кадастровый номер принятия решения:'}</b> <span className={classes.item}>{getValue('c_earth')}</span>
          </div>
        })
      )}
    </div>
  );
};
