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
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
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
import { getClaims, getUserId } from "utils/user";
import * as Yup from "yup";
import { useMessageContext } from "context/MessageContext";
import { DocumentHistory } from "./DocumentHistory";
import DescriptionIcon from "@material-ui/icons/Description";
import HistoryIcon from "@material-ui/icons/History";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import PrintIcon from "@material-ui/icons/Print";
import { DocumentPrint } from "./DocumentPrint";
import { DistinctSelectEditorField } from "components/table/Editors";
import { COLORS } from "./DocumentsPanel";

const useStyles = makeStyles((theme) => ({
  Paper: {
    width: "calc(100% - 40px)",
    // padding: theme.spacing(3),
    height: "calc(100% - 64px)",
  },
  titleWrapper: {
    display: "flex",
    margin: "20px",
    gap: "10px",
  },
  title: {
    flex: 1,
  },
}));

const STATE = {
  DETAIL: {
    title: "Заявка",
    icon: <DescriptionIcon />,
  },
  PRINT: {
    title: "Печать",
    icon: <PrintIcon />,
  },
  HISTORY: {
    title: "История",
    icon: <HistoryIcon />,
  },
};

export const DocumentsDetail = ({
  recordID,
  open,
  setOpen,
  onSubmit = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState("DETAIL");
  const [jbchild, setjbchild] = useState([]);
  const [hiddenChilds, setHiddenChilds] = useState({});

  const isReadOnly = getClaims().indexOf(".readonly.") >= 0;
  const isFullAccess = getClaims().indexOf(".full.") >= 0;
  const isOnlyChange = getClaims().indexOf(".change.") >= 0;
  const { ShowAcceptWindow } = useMessageContext();

  const classes = useStyles();
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setFieldValue,
    resetForm,
    errors,
    setValues,
    validateField,
    validateForm,
  } = useFormik({
    // validateOnMount: true,
    validationSchema: Yup.object().shape({
      c_fio: Yup.string().nullable().required("Не заполнено обязательное поле"),
      d_birthday: Yup.date()
        .nullable()
        .required("Не заполнено обязательное поле"),
      n_year: Yup.number()
        .nullable()
        .required("Не заполнено обязательное поле"),
      c_document: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      c_address: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      d_date: Yup.date().nullable().required("Не заполнено обязательное поле"),
      c_time: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      c_intent: Yup.string()
        .nullable()
        .required("Не заполнено обязательное поле"),
      // c_account: Yup.string()
      //   .nullable()
      //   .required("Не заполнено обязательное поле"),
    }),
    // enableReinitialize: true,
    // validateOnMount: true,
    initialValues: {
      n_number: "",
      c_fio: "",
      d_birthday: null,
      n_year: "",
      c_document: "",
      c_address: "",
      d_date: moment(),
      c_time: moment().format("HH:mm"),
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
      c_tag: '',
      c_import_doc: "",
      c_import_warning: "",
    },
    onSubmit: (values) => {
      values.jb_child = jbchild;
      if (values.id) {
        runRpc({
          action: "dd_documents",
          method: "Update",
          data: [
            {
              ...values,
              n_year: Number(values.n_year),
              jb_print: printState,
              f_user: getUserId(),
            },
          ],
          type: "rpc",
        }).finally(() => {
          setSubmitting(false);
          onSubmit();
        });
      } else {
        runRpcRecords({
          action: "dd_documents",
          method: "Query",
          data: [
            {
              filter: [
                {
                  property: "c_fio",
                  value: `${values.c_fio.replace(/[\s]+/g, "%")}`,
                  operator: "like",
                },
                {
                  property: "d_date",
                  value: values.d_date.startOf("day").toISOString(true),
                  operator: ">=",
                },
                {
                  property: "d_date",
                  value: values.d_date.endOf("day").toISOString(true),
                  operator: "<=",
                },
              ],
            },
          ],
        }).then((dd_docs_records) => {
          const addRequest = () => {
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
            })
              .then((last_dd_document) => {
                runRpc({
                  action: "dd_documents",
                  method: "Add",
                  data: [
                    {
                      ...values,
                      // n_number: last_dd_document.n_number + 1,
                      jb_print: {
                        position: last_dd_document.jb_print.position,
                        official_name: last_dd_document.jb_print.official_name
                      },
                      n_year: Number(values.n_year),
                    },
                  ],
                  type: "rpc",
                }).finally(() => {
                  setSubmitting(false);
                  onSubmit();
                });
              })
              .catch(() => {
                setSubmitting(false);
              });
          };
          if (dd_docs_records && dd_docs_records.length) {
            ShowAcceptWindow({
              title: "Предупреждение",
              components: (
                <div>
                  <p>
                    Вы действительно хотите добавить заявку? Существуют похожие
                    заявки:
                  </p>
                  <List>
                    {dd_docs_records.map((item) => {
                      const { n_number, d_date, c_fio, d_birthday } = item;
                      return (
                        <ListItem>
                          <ListItemText
                            primary={`Заявка № ${n_number}. Дата подачи: ${moment(
                              d_date
                            ).format("DD.MM.YYYY")}`}
                            secondary={`Заявитель: ${c_fio} ${moment(
                              d_birthday
                            ).format("DD.MM.YYYY")}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              ),
              buttons: [
                {
                  text: "Да",
                  color: "secondary",
                  handler: () => {
                    addRequest();
                  },
                },
                {
                  text: "Нет",
                  color: "primary",
                },
              ],
            });
          } else {
            addRequest();
          }
        });
      }
    },
  });

  const [printState, setPrintState] = useState({
    // registry: "13.04.2021 № 656",
    // land: "с 09.04.2021 под № 9914.",
    c_fio: "",
    c_address: "",
    text: "",
    number: "",
    date: "",
    registry: "",
    land: "",
    position:
      "Заместитель начальника управления ЖКХ, энергетики, транспорта и связи",
    official_name: "Д.С. Денисов",
  });

  useEffect(() => {
    const newValues = {
      number1: '',
      date1: '',
      number: values.n_number,
      date: moment(values.d_date).format("DD.MM.YYYY"),
      // registry: values.c_accept,
      registry: values.c_account,
      // land: values.c_account,
      c_fio: values.c_fio,
      c_address: values.c_address,
    };
    if (values.jb_print) {
      setPrintState({ ...printState, ...newValues, ...values.jb_print });
    } else {
      setPrintState({ ...printState, ...newValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

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
    setLoading(true);
    const dd_document = await runRpcSingleRecord({
      action: "dd_documents",
      method: "Query",
      data: [
        {
          filter: [
            {
              property: "id",
              value: recordID,
              operator: "=",
            },
          ],
        },
      ],
    });
    setjbchild(dd_document ? dd_document.jb_child || [] : []);
    if (dd_document && dd_document.jb_child) {
      const _hiddenChilds = {};
      for (let i = 0; i < dd_document.jb_child.length; i++) {
        _hiddenChilds[i] = true;
      }
      setHiddenChilds(_hiddenChilds);
    }
    setValues(dd_document);
    setLoading(false);
  };

  useEffect(() => {
    if (recordID !== -1) {
      loadData();
      validateForm(values);
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
      }).then((last_dd_document) => {
        setFieldValue("n_number", last_dd_document.n_number + 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordID]);

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
      <Tabs
        value={viewState}
        variant="fullWidth"
        indicatorColor="primary"
        onChange={(e, newValue) => setViewState(newValue)}
      >
        <Tab
          disabled={recordID === -1 || viewState === "DETAIL" || loading}
          // icon={STATE["DETAIL"].icon}
          label={STATE["DETAIL"].title}
          textColor="primary"
          value={"DETAIL"}
        />
        {recordID !== -1 && (
          <Tab
            disabled={viewState === "PRINT" || loading}
            // icon={STATE["PRINT"].icon}
            label={STATE["PRINT"].title}
            textColor="primary"
            value={"PRINT"}
          />
        )}
        {recordID !== -1 && (
          <Tab
            disabled={viewState === "HISTORY" || loading}
            // icon={STATE["HISTORY"].icon}
            label={STATE["HISTORY"].title}
            textColor="primary"
            value={"HISTORY"}
          />
        )}
      </Tabs>
      <DialogContent>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={"ru"}
        >
          {viewState === "DETAIL" && (
            <Box display="flex" flexDirection={"column"}>
              <Box
                display="flex"
                flexDirection={"column"}
                border="1px solid #c4c4c4"
                borderRadius="5px"
                margin="15px 0 15px 0"
              >
                <Typography style={{ margin: "15px 0 0 15px" }}>
                  Заявление
                </Typography>
                <Box
                  display="grid"
                  gridGap="15px"
                  gridTemplateColumns="1fr 1fr 1fr 3fr"
                  padding="10px"
                >
                  <TextField
                    {...options}
                    label={"Номер"}
                    name={"n_number"}
                    value={values.n_number}
                    disabled={!isFullAccess}
                  />
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label={"Дата подачи заявления"}
                    disabled={!isFullAccess}
                    name={"d_date"}
                    value={values.d_date}
                    error={errors.d_date}
                    helperText={errors.d_date}
                    format={dateFormat}
                    size="small"
                    InputAdornmentProps={{ position: "end" }}
                    onChange={onChangeDate("d_date")}
                  />
                  <TextField
                    {...options}
                    label={"Время подачи заявления"}
                    disabled={!isFullAccess}
                    error={errors.c_time}
                    helperText={errors.c_time}
                    name={"c_time"}
                    value={values.c_time}
                  />
                  <DistinctSelectEditorField
                    onChange={(value) => setFieldValue("c_intent", value)}
                    fieldProps={{
                      margin: "none",
                      size: "small",
                      idProperty: "id",
                      nameProperty: "c_intent",
                      table: "dd_documents",
                      error: errors.c_intent,
                      helperText: errors.c_intent,
                      disabled: !isFullAccess,
                    }}
                    label={"Цель использования земельного участка"}
                    name={"c_intent"}
                    value={values.c_intent}
                  />
                </Box>
              </Box>
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
                  gridTemplateColumns="1fr 1fr 1fr"
                  padding="10px"
                >
                  {/* <TextField
                    {...options}
                    label={"ФИО заявителя"}
                    disabled={!isFullAccess}
                   
                    
                  /> */}
                  <DistinctSelectEditorField
                    onChange={(value) => setFieldValue("c_fio", value)}
                    fieldProps={{
                      margin: "none",
                      size: "small",
                      idProperty: "id",
                      nameProperty: "c_fio",
                      table: "dd_documents",
                      error: errors.c_fio,
                      helperText: errors.c_fio,
                      disabled: !isFullAccess,
                    }}
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
                    disabled={!isFullAccess}
                    format={dateFormat}
                    size="small"
                    error={errors.d_birthday}
                    helperText={errors.d_birthday}
                    InputAdornmentProps={{ position: "end" }}
                    value={values.d_birthday}
                    onChange={(date) => {
                      setFieldValue(
                        "d_birthday",
                        moment(date).toISOString(true)
                      );
                      setFieldValue("n_year", moment().diff(date, "year"));
                      validateField("d_birthday");
                    }}
                  />
                  <TextField
                    {...options}
                    label={"Возраст на момент постановки"}
                    name={"n_year"}
                    disabled={!isFullAccess}
                    error={errors.n_year}
                    value={values.n_year}
                  />
                  <DistinctSelectEditorField
                    onChange={(value) => setFieldValue("c_address", value)}
                    fieldProps={{
                      margin: "none",
                      size: "small",
                      idProperty: "id",
                      nameProperty: "c_address",
                      table: "dd_documents",
                      error: errors.c_address,
                      helperText: errors.c_address,
                      style: { gridColumnStart: 1, gridColumnEnd: 3 },
                      disabled: !isFullAccess,
                    }}
                    label={"Адрес, телефон"}
                    name={"c_address"}
                    value={values.c_address}
                  />
                  <TextField
                    {...options}
                    label={"Реквизиты документа, удостоверяющего личность"}
                    name={"c_document"}
                    disabled={!isFullAccess}
                    error={errors.c_document}
                    helperText={errors.c_document}
                    value={values.c_document}
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
                <Box
                  display="flex"
                  flexDirection={"row"}
                  style={{
                    margin: "15px 15px 0 15px",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography style={{ flex: 1 }}>Родственники</Typography>
                  <Button
                    style={{ margin: "0 10px 10px 10px" }}
                    disabled={!isFullAccess}
                    onClick={() => {
                      // debugger;
                      // console.log(values.jb_child);
                      setjbchild([...jbchild, {}]);
                      setHiddenChilds({
                        ...hiddenChilds,
                        [Object.keys(hiddenChilds).length + 1]: true,
                      });
                      // setFieldValue()
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Добавить родственника
                  </Button>
                </Box>
                {jbchild.map((item, id) => {
                  return (
                    <>
                      <Box
                        display="grid"
                        gridGap="15px"
                        gridTemplateColumns="2fr 1fr 1fr 2fr"
                        margin="15px 0 0 0"
                        padding="0 10px 10px 10px"
                      >
                        <TextField
                          {...options}
                          onChange={onChangeJbChild(id, "c_fio")}
                          disabled={!isFullAccess}
                          label={"ФИО"}
                          name={`c_fio`}
                          value={item.c_fio || ""}
                        />
                        <KeyboardDatePicker
                          autoOk
                          variant="inline"
                          inputVariant="outlined"
                          label={"Дата рождения"}
                          disabled={!isFullAccess}
                          value={item.d_birthday || null}
                          format={dateFormat}
                          size="small"
                          InputAdornmentProps={{ position: "end" }}
                          onChange={(e) => {
                            jbchild[id] = {
                              ...jbchild[id],
                              d_birthday: moment(e).toISOString(true),
                            };
                            jbchild[id] = {
                              ...jbchild[id],
                              n_year: moment().diff(e, "year"),
                            };
                            setjbchild([...jbchild]);
                          }}
                        />
                        <TextField
                          {...options}
                          onChange={onChangeJbChild(id, "n_year")}
                          disabled={!isFullAccess}
                          label={"Возраст на момент постановки"}
                          name={`n_year`}
                          value={item.n_year ? item.n_year : "0"}
                          error={item.n_year >= 18}
                          helperText={
                            item.n_year >= 18 ? "Возраст >= 18 лет" : ""
                          }
                        />
                        <TextField
                          {...options}
                          onChange={onChangeJbChild(id, "c_document")}
                          disabled={!isFullAccess}
                          label={
                            "Реквизиты документа, удостоверяющего личность"
                          }
                          name={`c_document`}
                          value={item.c_document || ""}
                        />
                        {!hiddenChilds[id] && (
                          <>
                            <TextField
                              {...options}
                              onChange={onChangeJbChild(id, "c_address")}
                              disabled={!isFullAccess}
                              label={"Адрес, телефон"}
                              name={`c_address`}
                              value={item.c_address || ""}
                              style={{ gridColumnStart: 1, gridColumnEnd: 3 }}
                            />
                            <TextField
                              {...options}
                              onChange={onChangeJbChild(id, "c_note")}
                              disabled={!isFullAccess}
                              multiline
                              rows={4}
                              label={"Примечание"}
                              name={`c_note`}
                              value={item.c_note || ""}
                              style={{ gridColumnStart: 3, gridColumnEnd: 5 }}
                            />
                          </>
                        )}
                      </Box>

                      <Box
                        display="flex"
                        flexDirection={"row"}
                        style={{
                          margin: "0 15px 15px auto",
                          gap: '15px',
                          alignItems: "center",
                        }}
                      >
                        <Button
                          style={{ width: "100px" }}
                          onClick={() => {
                            setHiddenChilds({
                              ...hiddenChilds,
                              [id]: !hiddenChilds[id],
                            });
                          }}
                          color="primary"
                          variant="contained"
                        >
                          {hiddenChilds[id] ? "Показать" : "Скрыть"}
                        </Button>
                        <Button
                          style={{ width: "100px" }}
                          disabled={!isFullAccess}
                          onClick={() => {
                            ShowAcceptWindow({
                              title: "Предупреждение",
                              components: `Вы действительно хотите удалить родственника? Данные могут быть потеряны.`,
                              buttons: [
                                {
                                  text: "Да",
                                  color: "secondary",
                                  handler: () => {
                                    jbchild.splice(id, 1);
                                    setjbchild([...jbchild]);
                                  },
                                },
                                {
                                  text: "Нет",
                                  color: "primary",
                                },
                              ],
                            });
                          }}
                          color="primary"
                          variant="contained"
                        >
                          Удалить
                        </Button>
                      </Box>
                    </>
                  );
                })}
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
                    disabled={isReadOnly}
                    label={"Дата и номер принятия решения"}
                    name={"c_accept"}
                    value={values.c_accept}
                  />
                  <TextField
                    {...options}
                    disabled={isReadOnly}
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
                  Др. поля
                </Typography>
                <Box
                  display="grid"
                  gridGap="15px"
                  gridTemplateColumns="1fr 1fr"
                  padding="10px"
                >
                  <TextField
                    {...options}
                    style={{ backgroundColor: COLORS[values.c_tag] }}
                    select
                    label={"Тег"}
                    disabled={!isFullAccess}
                    name={"c_tag"}
                    error={errors.c_tag}
                    helperText={errors.c_tag}
                    value={values.c_tag}
                  >
                    {Object.keys(COLORS).map((key) => (
                      <MenuItem style={{backgroundColor: COLORS[key]}} key={key} value={key}>
                         {key}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    {...options}
                    label={"Номер телефона"}
                    disabled={!isFullAccess}
                    name={"c_phone"}
                    error={errors.c_phone}
                    helperText={errors.c_phone}
                    value={values.c_phone}
                  />
                  <TextField
                    {...options}
                    label={"Постановление о постановке на учет"}
                    disabled={!isFullAccess}
                    name={"c_account"}
                    error={errors.c_account}
                    helperText={errors.c_account}
                    value={values.c_account}
                  />
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label={"Решение о снятии с учета"}
                    disabled={!isFullAccess}
                    name={"d_take_off_solution"}
                    error={errors.d_take_off_solution}
                    helperText={errors.d_take_off_solution}
                    value={values.d_take_off_solution || null}
                    format={dateFormat}
                    size="small"
                    InputAdornmentProps={{ position: "end" }}
                    onChange={onChangeDate("d_take_off_solution")}
                  />
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label={"Сообщение заявителю о снятии с учета"}
                    disabled={!isFullAccess}
                    name={"d_take_off_message"}
                    value={values.d_take_off_message || null}
                    format={dateFormat}
                    size="small"
                    InputAdornmentProps={{ position: "end" }}
                    onChange={onChangeDate("d_take_off_message")}
                  />
                  <TextField
                    {...options}
                    label={"Примечание"}
                    style={{ gridColumnStart: 1, gridColumnEnd: 3 }}
                    disabled={!isFullAccess}
                    multiline
                    rows={4}
                    name={"c_notice"}
                    value={values.c_notice}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {viewState === "PRINT" && (
            <DocumentPrint
              values={values}
              state={printState}
              setState={setPrintState}
            />
          )}
          {viewState === "HISTORY" && <DocumentHistory id={values.id} />}
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        {values.id && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              ShowAcceptWindow({
                title: "Предупреждение",
                components: `Вы действительно хотите удалить заявку? Данные могут быть потеряны.`,
                buttons: [
                  {
                    text: "Да",
                    color: "secondary",
                    handler: () => {
                      runRpc({
                        action: "dd_documents",
                        method: "Delete",
                        data: [{ id: values.id }],
                        type: "rpc",
                      }).finally(() => {
                        onSubmit();
                      });
                    },
                  },
                  {
                    text: "Нет",
                    color: "primary",
                  },
                ],
              });
            }}
            disabled={!isFullAccess || loading}
          >
            Удалить
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isReadOnly || loading}
          startIcon={<SaveAltIcon />}
        >
          Сохранение
        </Button>
        <Button variant="contained" onClick={onClose} color="primary">
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
