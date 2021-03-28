import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { BoolEditor, SelectEditor } from "components/table/Editors";
import { SelectUik } from "components/SelectUik";
import { SelectSubdivision } from "components/SelectSubdivision";
import * as Yup from "yup";
import { AddHouse } from "./AddHouse";
import { AddNewAppartament, useAppartament } from "../AddNewAppartament";
import { AppartamentDisableMenu } from "../AppartamentDisableMenu";
import { Window } from "../HouseDetail";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  formWrapper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: 0,
    // minWidth: 300,
  },
  title: {
    textAlign: "center",
  },
  fieldWrapper: {
    display: "grid",
    gap: theme.spacing(1),
    gridTemplateColumns: "1fr 1fr",
  },
}));

export const EditHouse = ({
  id,
  refreshPage,
  handleClose,
  enableDelete = false,
  validate = () => {},
}) => {
  const schema = {
    c_house_number: Yup.string()
      .nullable()
      .required("Не заполнено обязательное поле"),
    n_uik: Yup.string().nullable().required("Не заполнено обязательное поле"),
    f_subdivision: Yup.string()
      .nullable()
      .required("Не заполнено обязательное поле"),
    f_street: Yup.string()
      .nullable()
      .required("Не заполнено обязательное поле"),
  };
  if (!enableDelete) {
    schema.b_check = Yup.boolean().typeError(
      "Должно быть указано одно из значений"
    );
  }
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldValue,
    errors,
  } = useFormik({
    validationSchema: Yup.object().shape(schema),
    initialValues: {
      id: id,
      c_house_number: "",
      c_house_corp: "",
      c_house_litera: "",
      n_uik: "",
      f_subdivision: "",
      b_disabled: false,
      f_street: "",
      c_notice: "",
      b_check: false,
    },
    onSubmit: (values) => {
      validate(values.c_house_number, () => {
        return (success) => {
          if (success) {
            runRpc({
              action: "cs_house",
              method: "Update",
              data: [{ ...values, f_user: getUserId() }],
              type: "rpc",
            }).then((responce) => {
              refreshPage();
              setSubmitting(false);
            });
          } else {
            setSubmitting(false);
          }
        };
      });
    },
  });

  useEffect(() => {
    runRpc({
      action: "cs_house",
      method: "Query",
      data: [
        {
          filter: [
            {
              property: "id",
              value: id,
              operator: "=",
            },
          ],
          limit: 1,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setValues(responce.result.records[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const classes = useStyles();
  return (
    <Paper className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Редактирование дома
        </Typography>
        {enableDelete ? null : (
          <div className={classes.fieldWrapper}>
            <FormControl
              required
              error={errors.b_check}
              component="fieldset"
              className={classes.formControl}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={values.b_check === true}
                    onClick={() => setFieldValue("b_check", true)}
                    name="b_check"
                  />
                }
                label="Подтверждаю"
              />
              <FormHelperText>{errors.b_check || ""}</FormHelperText>
            </FormControl>
            <FormControl
              required
              error={errors.b_check}
              component="fieldset"
              className={classes.formControl}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={values.b_check === false}
                    onClick={() => setFieldValue("b_check", false)}
                    name="b_check"
                  />
                }
                label="Не подтверждаю"
              />
              <FormHelperText>{errors.b_check || ""}</FormHelperText>
            </FormControl>
          </div>
        )}
        <div className={classes.fieldWrapper}>
          <SelectSubdivision
            margin="none"
            size="small"
            name="f_subdivision"
            value={values.f_subdivision}
            error={errors.f_subdivision}
            handleChange={(...props) => {
              setFieldValue("n_uik", "");
              handleChange(...props);
            }}
            isSubmitting={isSubmitting}
          />
          <SelectUik
            margin="none"
            size="small"
            name="n_uik"
            subdivision={values.f_subdivision}
            value={values.n_uik}
            error={errors.n_uik}
            handleChange={handleChange}
            isSubmitting={isSubmitting}
          />
          <SelectEditor
            name={"f_street"}
            fieldProps={{
              margin: "none",
              size: "small",
              helperText: errors.f_street,
              error: errors.f_street,
              idProperty: "id",
              nameProperty: "c_name",
              table: "cv_street",
            }}
            label="Улица"
            // mapAccessor="n_uik"
            value={values.f_street}
            setFieldValue={setFieldValue}
          />
          <TextField
            size="small"
            label="Номер"
            name="c_house_number"
            value={values.c_house_number}
            error={errors.c_house_number}
            helperText={errors.c_house_number}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          <TextField
            size="small"
            label="Корпус"
            name="c_house_corp"
            value={values.c_house_corp}
            error={errors.c_house_corp}
            helperText={errors.c_house_corp}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          <TextField
            size="small"
            label="Литера"
            name="c_house_litera"
            value={values.c_house_litera}
            error={errors.c_house_litera}
            helperText={errors.c_house_litera}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="outlined"
          />
          {enableDelete ? (
            <BoolEditor
              size="small"
              margin="none"
              error={errors.b_disabled}
              helperText={errors.b_disabled}
              label="Активен"
              name="b_disabled"
              value={!values.b_disabled}
              // onChange={handleChange}
              onChange={(e) => setFieldValue(e.target.name, !e.target.value)}
              disabled={isSubmitting}
              variant="outlined"
            />
          ) : null}
        </div>
        <TextField
          multiline
          rows={3}
          size="small"
          label="Примечание"
          name="c_notice"
          value={values.c_notice}
          error={errors.c_notice}
          helperText={errors.c_notice}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="outlined"
        />
        <div className={classes.fieldWrapper}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            Сохранить
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={isSubmitting}
            onClick={() => handleClose()}
          >
            Отменить
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export const useHouse = (props) => {
  const { onSave = () => {}, onCancel = () => {}, enableDelete = true } =
    props || {};
  const [house, setHouse] = useState(null);
  const [street, setStreet] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppartament, setSelectedAppartament] = useState(null);
  const [open, setOpen] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const [foundHouse, setFoundHouse] = useState([]);
  const [name, setName] = useState("");
  const [func, setFunc] = useState(null);

  const loadFoundData = (name, callback) => {
    const filter = [
      {
        property: "f_street",
        value: street,
        operator: "=",
      },
      {
        property: "c_house_number",
        value: name,
        operator: "=",
      },
    ];
    if (house) {
      filter.push({
        property: "id",
        value: house,
        operator: "<>",
      });
    }
    runRpc({
      action: "cs_house",
      method: "Query",
      data: [
        {
          limit: 1000,
          filter,
        },
      ],
      type: "rpc",
    }).then((response) => {
      const records = response.result.records;
      callback(records);
    });
  };

  const validateHouse = async (_name = "", _func) => {
    if (_name) {
      setName(_name);
      loadFoundData(_name, (records) => {
        setFoundHouse(records);
        if (records && records.length) {
          setWindowOpen(true);
          setFunc(_func);
        } else {
          _func()(true);
        }
      });
    } else {
      _func()(false);
    }
  };

  const handleSave = (id) => {
    onSave(id);
    setHouse(null);
    setStreet(null);
  };
  const {
    addNewForm,
    appartamentsController,
    appartaments,
    loadData,
  } = useAppartament({
    enableDelete: true,
    setAnchorEl: setAnchorEl,
    setSelectedAppartament: setSelectedAppartament,
    houseId: house,
    street: street,
  });

  const onClose = () => {
    setWindowOpen(false);
    func(false);
    setFunc(null);
  };

  const toggleState = (id, value) => {
    runRpc({
      action: "cs_house",
      method: "Update",
      data: [{ b_disabled: !Boolean(value), id: id }],
      type: "rpc",
    }).then(() => {
      loadFoundData(name, (records) => {
        setFoundHouse(records);
      });
    });
  };

  return {
    openHouse: (f_street, f_house) => {
      setHouse(f_house);
      setStreet(f_street);
    },
    addHouse: (f_street) => {
      setHouse(null);
      setStreet(f_street);
    },
    component: (
      <>
        <Dialog open={windowOpen} onClose={onClose}>
          <DialogTitle>Возможные дубликаты:</DialogTitle>
          <DialogContent>
            {foundHouse.map((item) => {
              return (
                <Box marginBottom="16px" display={"flex"} alignItems={"center"}>
                  <Box marginRight="16px">
                    <Typography>
                      Дом: {item.c_house_number}
                      {item.c_house_litera}{" "}
                      {item.c_house_corp ? `корп. ${item.c_house_corp}` : ""}
                      УИК: {item.n_uik || "нет"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleState(item.id, item.b_disabled)}
                  >
                    {item.b_disabled ? "Активировать" : "Деактивировать"}{" "}
                  </Button>
                </Box>
              );
            })}
            <Typography style={{ color: "red" }}>Активация/деактивация других домов происходит сразу, сохранить и отмена относятся к изменениям текущего выбранного дома</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant={"contained"}
              color="primary"
              onClick={() => {
                if (func) {
                  setWindowOpen(false);
                  func(true);
                  setFunc(null);
                }
              }}
            >
              Сохранить
            </Button>
            <Button onClick={onClose}>Отмена</Button>
          </DialogActions>
        </Dialog>
        {street && !house && (
          <AddHouse
            validate={validateHouse}
            street={street}
            refreshPage={(id) => handleSave(id)}
          />
        )}
        {street && house && (
          <>
            {selectedAppartament && (
              <AppartamentDisableMenu
                onSave={() => loadData()}
                selectedAppartament={selectedAppartament}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setOpen={setOpen}
              />
            )}
            <EditHouse
              validate={validateHouse}
              enableDelete={enableDelete}
              id={house}
              refreshPage={handleSave}
              handleClose={() => {
                onCancel();
                setHouse(null);
                setStreet(null);
              }}
            />
            <Window
              item={selectedAppartament}
              reloadData={loadData}
              open={open}
              handleClose={() => {
                setOpen(false);
                setSelectedAppartament(null);
              }}
            />
            {addNewForm}
            {appartamentsController}
            {appartaments}
          </>
        )}
      </>
    ),
  };
};
