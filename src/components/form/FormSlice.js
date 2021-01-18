import { createSlice } from "@reduxjs/toolkit";
import {
  getReactFromExtJSView,
  updateFormObject,
} from "components/form/ComponentTreeHelpers";

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

const FormSlice = createSlice({
  name: "form",
  initialState: {
    form: getReactFromExtJSView(form),
    containerId: null,
    componentId: null,
    edit: false,
  },
  reducers: {
    setEdit: (state, payload) => {
      state.edit = payload.edit;
    },
    setFormState: (state, payload) => {
      state.form = updateFormObject({
        ...payload.props,
        formContent: state.form,
      });
    },
    setSelectedComponent: (state, payload) => {
      const { containerId, componentId } = payload;
      state.containerId = containerId;
      state.componentId = componentId;
    },
    updateSelectedComponent: (state, payload) => {
      const { props } = payload;
      if (state.containerId && state.componentId !== null) {
        state.form[state.containerId].items[state.componentId] = {
          ...state.form[state.containerId].items[state.componentId],
          ...props,
        };
        
      }
    },
  },
});

export default FormSlice.reducer;
