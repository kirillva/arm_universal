import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { auth } from "utils/user";
import { withRouter } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
  },
  formWrapper: {
    maxWidth: 540,
    height: "100%",
    margin: "auto",
    padding: theme.spacing(3),
  },
  title: {
    textAlign: "center",
  },
}));

export const SigninForm = withRouter(({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, handleChange, values, isSubmitting } = useFormik({
    initialValues: {
      login: "",
      password: "",
      remember: true,
    },
    onSubmit: (values) => {
      auth({
        login: values.login,
        password: values.password,
        persist: true,
      }).then(() => {
        history.push("/");
      });
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Paper className={classes.formWrapper}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="h6" className={classes.title}>
            Вход
          </Typography>
          <TextField
            label="Логин"
            name="login"
            value={values.login}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="filled"
          />
          <TextField
            type={showPassword ? "text" : "password"}
            label="Пароль"
            name="password"
            value={values.password}
            onChange={handleChange}
            disabled={isSubmitting}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            Войти
          </Button>
        </form>
      </Paper>
    </div>
  );
});
