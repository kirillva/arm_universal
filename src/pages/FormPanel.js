import React from "react";
import { makeStyles } from "@material-ui/styles";
import FormWrapper from "components/form/FormWrapper";
import { TextFieldOptions } from "components/form/TextFieldOptions";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { GetGUID } from "utils/helpers";
import { getExtJSFromReactView } from "components/form/ComponentTreeHelpers";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  form: {
    flex: 2
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

export const FormPanel = () => {
  const classes = useStyles();

  const { form, edit: formEdit } = useSelector((state) => state.form);

  const dispatch = useDispatch();

  const assignFormContent = (props) => {
    dispatch({
      type: "form/setFormState",
      props,
    });
  };

  const onSaveForm = () => {
    const _form = getExtJSFromReactView(form);
    console.log(_form);
  };

  const onAddContainer = () => {
    assignFormContent({
      items: [],
      id: GetGUID(),
      parentId: [],
    });
  };

  const onChangeMode = () => {
    dispatch({
      type: "form/setEdit",
      edit: !formEdit,
    });
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.formWrapper}>
        <div className={classes.form}>
          <div className={classes.buttons}>
            <Button color="primary" variant="contained" onClick={onAddContainer}>
              Добавить контейнер
          </Button>
            <Button color="primary" variant="contained" onClick={onSaveForm}>
              Сохранить форму
          </Button>
            <Button color="primary" variant="contained" onClick={onChangeMode}>
              {formEdit ? "Режим просмотра" : "Режим редактирования"}
            </Button>
          </div>
          <FormWrapper items={form} updateLayout={assignFormContent} />
        </div>
        {formEdit && <TextFieldOptions />}
      </div>
    </div>
  );
};
