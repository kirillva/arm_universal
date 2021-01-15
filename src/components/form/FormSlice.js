import { createSlice } from "@reduxjs/toolkit";
import {
  getExtJSFromReactView,
  // getExtJSFromReactView,
  getReactFromExtJSView,
  updateFormObject,
} from "components/form/ComponentTreeHelpers";
import _ from "lodash";

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
  name: 'form',
  initialState: getReactFromExtJSView(form),
  reducers: {
    setFormState: (state, payload) => {
      state = updateFormObject({ ...payload.props, formContent: state }) 
    },
  },
})

export const { setFormState } = FormSlice.actions

export default FormSlice.reducer