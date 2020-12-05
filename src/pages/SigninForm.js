import React from "react";
import { useFormik } from "formik";
import { TextField } from "@material-ui/core";

export const SigninForm = () => {
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      login: "",
      password: "",
      remember: true,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextField onChange={handleChange} name="login" value={values.login}/>
      <TextField onChange={handleChange} type="password" name="password" value={values.password}/>
      <button type="submit">Submit</button> 
    </form>
  );
};
