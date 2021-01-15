import React from "react";
import { makeStyles } from "@material-ui/styles";
import FormWrapper from "components/form/FormWrapper";
import { TextFieldOptions } from "components/form/TextFieldOptions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const FormPanel = () => {
  const classes = useStyles();

  const { form } = useSelector((state) => state.form);

  const dispatch = useDispatch();

  const assignFormContent = (props) => {
    dispatch({
      type: "form/setFormState",
      props,
    });
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      {/* <div>
        <button
          onClick={() => {
            assignFormContent({
              items: [],
              id: GetGUID(),
              parentId: [],
            });
          }}
        >
          Добавить контейнер
        </button>
        <button
          onClick={() => {
            const _form = getExtJSFromReactView(form);
            console.log(_form);
          }}
        >
          Сохранить форму
        </button>
      </div> */}
      <FormWrapper items={form} updateLayout={assignFormContent} />
      <TextFieldOptions />
    </div>
  );
};
