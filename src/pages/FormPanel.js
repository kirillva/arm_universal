import React from "react";
import { makeStyles } from "@material-ui/styles";
import { renderForm } from "components/reduxForm/ReduxFormHelpers";
import { TextFieldOptions } from "components/reduxForm/TextFieldOptions";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
  },
  form: {
    flex: 2,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const FormPanel = () => {
  const classes = useStyles();

  const { form, edit: formEdit } = useSelector((state) => state.reduxForm);

  const dispatch = useDispatch();
  const onSaveForm = () => {
    console.log(form);
  };

  const onAddContainer = () => {
    debugger;
  };

  // const onChangeMode = () => {
  //   dispatch({
  //     type: "reduxForm/setEdit",
  //     edit: !formEdit,
  //   });
  // };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.formWrapper}>
        <div className={classes.form}>
          <div className={classes.buttons}>
            {/* <Button
              color="primary"
              variant="contained"
              onClick={onAddContainer}
            >
              Добавить контейнер
            </Button> */}
            <Button color="primary" variant="contained" onClick={onSaveForm}>
              Сохранить форму
            </Button>
            {/* <Button color="primary" variant="contained" onClick={onChangeMode}>
              {formEdit ? "Режим просмотра" : "Режим редактирования"}
            </Button> */}
          </div>
          {renderForm(form)}
        </div>
        {formEdit && <TextFieldOptions />}
      </div>
    </div>
  );
};
