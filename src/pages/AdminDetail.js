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
} from "@material-ui/core";
import { runRpc, runRpcRecords } from "utils/rpc";

export const AdminDetail = ({ record, open, setOpen, onSubmit = () => {} }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
    setSubmitting,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      c_login: "",
      c_password: "",
      c_first_name: "",
      c_description: "",
      b_disabled: false,
      c_phone: "",
      c_email: "",
      c_claims: "",
      ...record,
    },
    onSubmit: (values) => {
      if (values.id) {
        const {
          c_login,
          c_password,
          c_first_name,
          c_description,
          b_disabled,
          c_phone,
          c_email,
        } = values;
        runRpc({
          action: "pd_users",
          method: "Update",
          data: [
            {
              c_login,
              c_password,
              c_first_name,
              c_description,
              b_disabled,
              c_phone,
              c_email,
            },
          ],
          type: "rpc",
        }).then(() => {
          runRpc({
            action: "pd_userinroles",
            method: "Update",
            data: [{ id: values.f_role, f_role: values.c_claims }],
            type: "rpc",
          }).then(() => {
            onSubmit(values);
            setSubmitting(false);
          });
        });
      } else {
        const {
          c_login,
          c_password,
          c_first_name,
          c_description,
          b_disabled,
          c_phone,
          c_email,
        } = values;
        runRpc({
          action: "pd_users",
          method: "Add",
          data: [
            {
              c_login,
              c_password,
              c_first_name,
              c_description,
              b_disabled,
              c_phone,
              c_email,
            },
          ],
          type: "rpc",
        }).then((response) => {
          if (response.sql.rows && response.sql.rows.length) {
            runRpc({
              action: "pd_userinroles",
              method: "Add",
              data: [
                { f_user: response.sql.rows[0].id, f_role: values.c_claims },
              ],
              type: "rpc",
            }).then(() => {
              onSubmit(values);
              setSubmitting(false);
            });
          }
        });
      }
    },
  });

  const loadData = async () => {
    setLoading(true);
    const _roles = await runRpcRecords({
      action: "pd_roles",
      method: "Query",
      data: [
        {
          limit: 1000,
          select: "id,c_name,c_description",
          filter: [
            {
              property: "c_name",
              value: ["full", "change", "readonly"].map((key) => `'${key}'`),
              operator: "in",
            },
          ],
        },
      ],
    });
    setRoles(_roles);
    const _claims = await runRpcRecords({
      action: "pd_userinroles",
      method: "Query",
      data: [
        {
          limit: 1000,
          select: "id,f_role,f_user,f_user___c_login,f_user___c_first_name",
          filter: [
            {
              property: "f_user",
              value: record.id,
              operator: "=",
            },
          ],
        },
      ],
    });
    if (_claims.length) {
      setFieldValue("c_claims", _claims[0].f_role);
      setFieldValue("f_role", _claims[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (record && record.id) {
      loadData();
      console.log("values", values);
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

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Пользователь</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={"column"}>
          <Box
            display="grid"
            gridGap="15px"
            gridTemplateColumns="1fr 1fr"
            margin="15px 0 15px 0"
          >
            <TextField
              label="Логин"
              name={"c_login"}
              value={values.c_login}
              {...options}
            />
            <TextField
              label="Пароль"
              name={"c_password"}
              value={values.c_password}
              {...options}
            />
            <TextField
              label="ФИО"
              name={"c_first_name"}
              value={values.c_first_name}
              {...options}
            />
            <TextField
              label="Описание"
              name={"c_description"}
              value={values.c_description}
              {...options}
            />
            <TextField
              label="Телефон"
              name={"c_phone"}
              value={values.c_phone}
              {...options}
            />
            <TextField
              label="Удален"
              name={"b_disabled"}
              value={values.b_disabled}
              {...options}
              select
              onChange={(e) => setFieldValue("b_disabled", e.target.value)}
            >
              <MenuItem value={true}>Да</MenuItem>
              <MenuItem value={false}>Нет</MenuItem>
            </TextField>
            <TextField
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
            />
          </Box>
          {/* <Button
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        disabled={isSubmitting}
      >
        Войти
      </Button> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Сохранение
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          color="primary"
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
