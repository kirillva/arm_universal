import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@material-ui/core";
import { runRpc, runRpcRecords, runRpcSingleRecord } from "utils/rpc";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/ru";
import moment from "moment";
import Card from "@material-ui/core/Card";
import { getUserId } from "utils/user";

const useStyles = makeStyles((theme) => ({
  Paper: {
    width: "calc(100% - 40px)",
    // padding: theme.spacing(3),
  },
}));

export const DocumentsDetail = ({
  record,
  open,
  setOpen,
  onSubmit = () => {},
}) => {
  const [loading, setLoading] = useState(true);
  const [jbchild, setjbchild] = useState([]);

  const classes = useStyles();
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setFieldValue,
    resetForm,

    setValues,
  } = useFormik({
    // enableReinitialize: true,
    initialValues: {
      n_number: "",
      c_fio: "",
      d_birthday: moment(),
      n_year: "",
      c_document: "",
      c_address: "",
      d_date: moment(),
      c_time:  moment().format('HH.mm'),
      c_intent: "",
      c_account: "",
      c_accept: "",
      c_earth: "",
      d_take_off_solution: null,
      d_take_off_message: null,
      c_notice: "",
      f_user: getUserId(),
      sn_delete: false,
      // jb_child: [],
      c_import_doc: "",
      c_import_warning: ""
    },
    onSubmit: (values) => {
      values.jb_child = jbchild;
      if (values.id) {
        runRpc({
          action: "dd_documents",
          method: "Update",
          data: [{...values, n_year: Number(values.n_year)}],
          type: "rpc",
        }).finally(() => {
          setSubmitting(false);
          onSubmit();
        });
      } else {
        runRpcSingleRecord({
          action: "dd_documents",
          method: "Query",
          data: [
            {
              sort: [
                {
                  property: "n_number",
                  direction: "desc",
                },
              ],
            },
          ],
        }).then(last_dd_document=>{
          runRpc({
            action: "dd_documents",
            method: "Add",
            data: [{ ...values, n_number: last_dd_document.n_number + 1, n_year: Number(values.n_year) }],
            type: "rpc",
          }).finally(() => {
            setSubmitting(false);
            onSubmit();
          });
        }).catch(() => {
          setSubmitting(false);
        });
      }
    },
  });

  const onChangeJbChild = (id, name) => {
    return (e) => {
      if (name !== "d_birthday") {
        jbchild[id] = { ...jbchild[id], [name]: e.target.value };
      } else {
        jbchild[id] = { ...jbchild[id], [name]: moment(e).toISOString(true) };
      }
      setjbchild([...jbchild]);
    };
  };
  const loadData = async () => {
    if (record && record.id) {
      setLoading(true);
      const dd_document = await runRpcSingleRecord({
        action: "dd_documents",
        method: "Query",
        data: [
          {
            filter: [
              {
                property: "id",
                value: record.id,
                operator: "=",
              },
            ],
          },
        ],
      });
      setjbchild(dd_document.jb_child || []);
      setValues(dd_document);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (record && record.id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const options = {
    disabled: isSubmitting,
    variant: "outlined",
    size: "small",
    margin: "none",
    onChange: handleChange,
  };
  const dateFormat = "DD.MM.YYYY";

  const onChangeDate = (name) => {
    return (date) => setFieldValue(name, moment(date).toISOString(true));
  };

  const onClose = () => {
    resetForm();
    setOpen(false);
    setjbchild([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{ className: classes.Paper }}
      maxWidth="calc(100% - 60px)"
    >
      <DialogTitle id="form-dialog-title">Документ</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={"ru"}
        >
          <Box display="flex" flexDirection={"column"}>
            <Box
              display="flex"
              flexDirection={"column"}
              border="1px solid #c4c4c4"
              borderRadius="5px"
            >
              <Typography style={{ margin: "15px 0 0 15px" }}>
                Заявитель
              </Typography>
              <Box
                display="grid"
                gridGap="15px"
                gridTemplateColumns="1fr 1fr"
                padding="10px"
              >
                {values.id && (
                  <TextField
                    {...options}
                    label={"Номер"}
                    name={"n_number"}
                    value={values.n_number}
                  />
                )}
                <TextField
                  {...options}
                  label={"ФИО заявителя"}
                  name={"c_fio"}
                  value={values.c_fio}
                />
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  name={"d_birthday"}
                  label={"Дата рождения"}
                  format={dateFormat}
                  size="small"
                  InputAdornmentProps={{ position: "end" }}
                  value={values.d_birthday || moment()}
                  onChange={onChangeDate("d_birthday")}
                />
                <TextField
                  {...options}
                  label={"Возраст на момент постановки"}
                  name={"n_year"}
                  value={values.n_year}
                />
                <TextField
                  {...options}
                  label={"Реквизиты документа, удостоверяющего личность"}
                  name={"c_document"}
                  value={values.c_document}
                />
                <TextField
                  {...options}
                  label={"Адрес, телефон"}
                  name={"c_address"}
                  value={values.c_address}
                />
                {/* <TextField
                {...options}
                label={"Дата подачи заявления"}
                name={"d_date"}
                value={values.d_date}
              /> */}

                {/* <TextField
              {...options}
              label={"Идентификатор пользователя"}
              name={"f_user"}
              value={values.f_user}
            /> */}
                {/* <TextField
              label="sn_delete"
              name={"sn_delete"}
              value={values.sn_delete}
              {...options}
              select
              onChange={(e) => setFieldValue("sn_delete", e.target.value)}
            >
              <MenuItem value={true}>Да</MenuItem>
              <MenuItem value={false}>Нет</MenuItem>
            </TextField> */}

                {/* <TextField
              label="Роли"
              name={"c_claims"}
              value={values.c_claims}
              {...options}
              select
              onChange={(e) => setFieldValue("c_claims", e.target.value)}
            >
              {roles.map((item) => (
                <MenuItem value={item.id}>{item.c_description}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="e-mail"
              name={"c_email"}
              value={values.c_email}
              {...options}
            /> */}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={"column"}
              border="1px solid #c4c4c4"
              borderRadius="5px"
              margin="15px 0 0 0"
            >
              <Typography style={{ margin: "15px 0 0 15px" }}>
                Заявление
              </Typography>
              <Box
                display="grid"
                gridGap="15px"
                gridTemplateColumns="1fr 1fr"
                padding="10px"
              >
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label={"Дата подачи заявления"}
                  name={"d_date"}
                  value={values.d_date}
                  format={dateFormat}
                  size="small"
                  InputAdornmentProps={{ position: "end" }}
                  onChange={onChangeDate("d_date")}
                />
                <TextField
                  {...options}
                  label={"Время подачи заявления"}
                  name={"c_time"}
                  value={values.c_time}
                />
                <TextField
                  {...options}
                  label={"Цель использования земельного участка"}
                  name={"c_intent"}
                  value={values.c_intent}
                />
                <TextField
                  {...options}
                  label={"Постановление о постановке на учет"}
                  name={"c_account"}
                  value={values.c_account}
                />
                {/* <TextField
                {...options}
                label={"Решение о снятии с учета"}
                name={"d_take_off_solution"}
                value={values.d_take_off_solution}
              /> */}
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label={"Решение о снятии с учета"}
                  name={"d_take_off_solution"}
                  value={values.d_take_off_solution || null }
                  format={dateFormat}
                  size="small"
                  InputAdornmentProps={{ position: "end" }}
                  onChange={onChangeDate("d_take_off_solution")}
                />
                {/* <TextField
                {...options}
                label={"Сообщение заявителю о снятии с учета"}
                name={"d_take_off_message"}
                value={values.d_take_off_message}
              /> */}
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label={"Сообщение заявителю о снятии с учета"}
                  name={"d_take_off_message"}
                  value={values.d_take_off_message || null }
                  format={dateFormat}
                  size="small"
                  InputAdornmentProps={{ position: "end" }}
                  onChange={onChangeDate("d_take_off_message")}
                />
                <TextField
                  {...options}
                  label={"Примечание"}
                  multiline
                  rows={4}
                  name={"c_notice"}
                  value={values.c_notice}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={"column"}
              border="1px solid #c4c4c4"
              borderRadius="5px"
              margin="15px 0 0 0"
            >
              <Typography style={{ margin: "15px 0 0 15px" }}>
                Решение
              </Typography>
              <Box
                display="grid"
                gridGap="15px"
                gridTemplateColumns="1fr 1fr"
                padding="10px"
              >
                <TextField
                  {...options}
                  label={"Дата и номер принятия решения"}
                  name={"c_accept"}
                  value={values.c_accept}
                />
                <TextField
                  {...options}
                  label={"Кадастровый номер принятия решения"}
                  name={"c_earth"}
                  value={values.c_earth}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection={"column"}
              border="1px solid #c4c4c4"
              borderRadius="5px"
              margin="15px 0 0 0"
            >
              <Typography style={{ margin: "15px 0 0 15px" }}>
                Родственники
              </Typography>
              {jbchild.map((item, id) => {
                return (
                  <>
                    <Box
                      display="grid"
                      gridGap="15px"
                      gridTemplateColumns="1fr 1fr"
                      margin="15px 0 0 0"
                      padding="0 10px 10px 10px"
                    >
                      <TextField
                        {...options}
                        onChange={onChangeJbChild(id, "c_fio")}
                        label={"ФИО"}
                        name={`c_fio`}
                        value={item.c_fio || ""}
                      />
                      {/* <TextField
                        {...options}
                        onChange={onChangeJbChild(id, "n_year")}
                        label={"Возраст"}
                        name={`n_year`}
                        value={item.n_year || ""}
                      /> */}
                      <TextField
                        {...options}
                        onChange={onChangeJbChild(id, "c_address")}
                        label={"Адрес, телефон"}
                        name={`c_address`}
                        value={item.c_address || ""}
                      />
                      <TextField
                        {...options}
                        onChange={onChangeJbChild(id, "c_document")}
                        label={"Реквизиты документа, удостоверяющего личность"}
                        name={`c_document`}
                        value={item.c_document || ""}
                      />
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label={"Дата рождения"}
                        value={item.d_birthday || moment()}
                        format={dateFormat}
                        size="small"
                        InputAdornmentProps={{ position: "end" }}
                        onChange={onChangeJbChild(id, "d_birthday")}
                      />
                    </Box>
                    <Button
                      style={{ width: "100px", margin: "0 10px 20px auto" }}
                      onClick={() => {
                        // debugger;
                        // console.log(values.jb_child);
                        jbchild.splice(id, 1);
                        setjbchild([...jbchild]);
                        // setFieldValue()
                      }}
                      color="primary"
                      variant="contained"
                    >
                      Удалить
                    </Button>
                  </>
                );
              })}
              {
                <Button
                  style={{ margin: "0 10px 10px 10px" }}
                  onClick={() => {
                    // debugger;
                    // console.log(values.jb_child);
                    setjbchild([...jbchild, {}]);
                    // setFieldValue()
                  }}
                  color="primary"
                  variant="contained"
                >
                  Добавить родственника
                </Button>
              }
            </Box>
            <Box
              display="flex"
              flexDirection={"column"}
              border="1px solid #c4c4c4"
              borderRadius="5px"
              margin="15px 0 0 0"
            >
              <Typography style={{ margin: "15px 0 0 15px" }}>
                Технические данные
              </Typography>
              <Box
                display="grid"
                gridGap="15px"
                gridTemplateColumns="1fr 1fr"
                padding="10px"
                borderRadius="5px"
              >
                <TextField
                  {...options}
                  label={"В рамках какого документа был импорт"}
                  name={"c_import_doc"}
                  value={values.c_import_doc}
                />
                <TextField
                  {...options}
                  label={"Текст предупреждения"}
                  name={"c_import_warning"}
                  value={values.c_import_warning}
                />
              </Box>
            </Box>
          </Box>
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Сохранение
        </Button>
        <Button variant="contained" onClick={onClose} color="primary">
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
