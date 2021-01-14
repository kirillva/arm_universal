import React, { useState } from "react";
import {
  getExtJSFromReactView,
  // getExtJSFromReactView,
  getReactFromExtJSView,
  updateFormObject,
} from "components/form/ComponentTreeHelpers";
import { makeStyles } from "@material-ui/styles";
import FormWrapper from "components/form/FormWrapper";
import { GetGUID } from "utils/helpers";

const form = [
  {
    xtype: "components",
    layout: "vbox",
    items: [
      {
        layout: "hbox",
        items: [
          {
            xtype: "textfield",
            fieldLabel: "First Name",
            name: "firstName",
          },
          {
            xtype: "textfield",
            fieldLabel: "Last Name",
            name: "lastName",
          },
        ],
      },
      {
        layout: "hbox",
        items: [
          {
            xtype: "numberfield",
            fieldLabel: "Date of Birth",
            name: "birthDate",
          },
          {
            xtype: "textfield",
            fieldLabel: "Last Name",
            name: "lastName1",
          },
        ],
      },
      {
        xtype: "textfield",
        fieldLabel: "Last Name",
        name: "lastName2",
      },
      {
        xtype: "combobox",
        fieldLabel: "Last Name",
        name: "lastName3",
      },
    ],
  },
];

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const FormPanel = () => {
  const classes = useStyles();

  const [formContent, setFormContent] = useState(getReactFromExtJSView(form));

  const assignFormContent = (props) => {
    setFormContent(updateFormObject({ ...props, formContent }));
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div>
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
            const _form = getExtJSFromReactView(formContent);

            console.log(_form);
          }}
        >
          Сохранить форму
        </button>
      </div>
      <FormWrapper items={formContent} updateLayout={assignFormContent} />
    </div>
  );
};
